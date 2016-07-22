var gulp = require('gulp');
var args = require('yargs').argv;
var browserSync = require('browser-sync').create();
var $ = require('gulp-load-plugins')({lazy: true});
var config = require('./gulp.config.js')();
var del = require('del');

gulp.task('help', $.taskListing);
gulp.task('default', ['help']);

gulp.task('sloc', function() {
    gulp.src(config.alljs)
        .pipe($.sloc());
});

gulp.task('vet', function () {
    log('Analyzing source with JSHint and JSCS');
    return gulp.src(config.alljs)
    .pipe($.if(args.verbose,$.print()))
    .pipe($.jscs())
    .pipe($.jscs.reporter())
    .pipe($.jshint())
    .pipe($.jshint.reporter('jshint-stylish', {verbose: true}))
    .pipe($.jshint.reporter('fail'))
;
});

gulp.task('styles',['clean-styles'], function () {
    log('Compiling Less --> CSS');

    return gulp
        .src(config.less)
        .pipe($.plumber())
        .pipe($.less())
        .pipe($.autoprefixer({browsers: ['last 2 versions', '> 5%']}))
        .pipe(gulp.dest(config.temp));
});

gulp.task('fonts', ['clean-fonts'], function () {
    log('Copying Fonts');
    return gulp.src(config.fonts)
        .pipe(gulp.dest(config.build + 'fonts'))
        .pipe(gulp.dest(config.stage + 'fonts'));
});

gulp.task('images', ['clean-images'],function () {
    log('Copying and compressing images');
    return gulp.src(config.images)
        .pipe($.imagemin({optimizationLevel: 4}))
        .pipe(gulp.dest(config.build + 'images'));
});

gulp.task('clean', function (done) {
    var delconfig = [].concat(config.build, config.temp, config.stage);
    log('Cleaning: ' + $.util.colors.yellow(delconfig));
    del(delconfig).then(log('Done'));
});

gulp.task('clean-fonts', function (done) {
    return clean(config.build + 'fonts/**/*.*', done);
});

gulp.task('clean-images', function (done) {
    return clean(config.build + 'images/**/*.*', done);
});

gulp.task('clean-styles', function (done) {
    return clean(config.temp + '**/*.css', done);
});

gulp.task('clean-code', function (done) {
    log('Cleaning code');
    var files = [].concat(
        config.temp + '**/*.js',
        config.build + '**/*.html',
        config.build + 'js/**/*.js'
    );
    return clean(files, done);
});

gulp.task('less-watcher', function () {
    gulp.watch([config.less], ['styles']);
});

// Configure the browserSync task
gulp.task('browserSyncStage', function() {
    browserSync.init({
        server: {
            baseDir: './.stage',
            index: 'index.html'
        }
    });
});

gulp.task('staging', ['browserSyncStage','stage'], function () {
    gulp.watch([config.css, config.js, config.htmltemplates],['stage',browserSync.reload]);
});

gulp.task('browserSyncBuild', function() {
    browserSync.init({
        server: {
            baseDir: './.build',
            index: 'index.html'
        }
    });
});

gulp.task('building', ['browserSyncBuild','build'], function () {
    gulp.watch([config.css, config.js, config.htmltemplates],['stage',browserSync.reload]);
});

gulp.task('templatecache', ['clean-code'], function () {
    log('Creating AngularJS $templateCache');
    return gulp
        .src(config.htmltemplates)
        .pipe($.minifyHtml({empty: true}))
        .pipe($.angularTemplatecache(
            config.templateCache.file,
            config.templateCache.options
        ))
        .pipe(gulp.dest(config.temp))
    ;
});

gulp.task('wiredep', function () {
    log('Wire up the bower css js and our app js into the html');
    var options = config.getWiredepDefaultOptions();
    var wiredep = require('wiredep').stream;

    return gulp
        .src(config.index)
        .pipe(wiredep(options))
        .pipe($.inject(gulp.src(config.js)))
        .pipe(gulp.dest(config.client));

});

gulp.task('inject', ['wiredep', 'styles', 'templatecache'], function () {
    log('Wire up the app css into the html, and call wiredep ');

    return gulp
        .src(config.index)
        .pipe($.inject(gulp.src(config.css)))
        .pipe(gulp.dest(config.client));
});

gulp.task('stage', ['inject', 'fonts','images'], function () {
    log('Optimizing the javascript, css, and HTML');
    var templateCache = config.temp + config.templateCache.file;

    return gulp
        .src(config.index)
        .pipe($.plumber())
        .pipe($.inject(
            gulp.src(templateCache, {read: false}), {
                starttag: '<!-- inject:templates:js -->'
            })
        )
        .pipe($.useref({searchPath: './'}))
        .pipe(gulp.dest(config.stage))
    ;
});

gulp.task('build', ['inject', 'fonts','images'], function () {
    log('Optimizing the javascript, css, and HTML');
    var templateCache = config.temp + config.templateCache.file;

    return gulp
        .src(config.index)
        .pipe($.plumber())
        .pipe($.inject(
            gulp.src(templateCache, {read: false}), {
                starttag: '<!-- inject:templates:js -->'
            })
        )
        .pipe($.useref({searchPath:'./'}))
        .pipe($.if('*.css',$.csso()))
        .pipe($.if('*.js',$.ngAnnotate()))
        .pipe($.if('*.js',$.uglify()))
        .pipe($.if('*.js',$.rev()))
        .pipe($.if('*.css',$.rev()))
        .pipe($.revReplace())
        .pipe(gulp.dest(config.build))
        .pipe($.rev.manifest())
        .pipe(gulp.dest(config.build))
    ;
});

gulp.task('bump', function() {
    var msg = 'Bumping versions';
    var type = args.type;
    var version = args.version;
    var options = {};
    if (version) {
        options.version = version;
        msg += ' to ' + version;
    } else {
        options.type = type;
        msg += ' for a ' + type;
    }
    log(msg);
    return gulp.src(config.packages)
        .pipe($.bump(options))
        .pipe($.print())
        .pipe(gulp.dest(config.root));
});

/////////////////////
function clean(path, done) {
    log('Cleaning ' + $.util.colors.red(path));
    return del(path).then(log('Done'));
}

function log(msg) {
    if (typeof(msg) === 'object') {
        for (var item in msg) {
            if (msg.hasOwnProperty(item)) {
                $.util.log($.util.colors.blue(msg[item]));
            }
        }
    } else {
        $.util.log($.util.colors.blue(msg));
    }
}
