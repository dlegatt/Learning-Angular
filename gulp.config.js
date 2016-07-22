module.exports = function () {
    var client = 'src/';
    var clientApp = client + 'app/';
    var temp = './.tmp/';
    var root = './';
    var config = {
        /**
         * Files and paths
         */
        temp: temp,
        client: client,
        allCode: [
            './src/**/*.js',
            './*.js',
            clientApp + '**/*.html',
            client + 'styules/main.css'
        ],
        alljs: [
            './src/**/*.js',
            './*.js'
        ],
        build: '.build/',
        stage: '.stage/',
        stageJs: this.stage + '**/*.js',
        stageHtml: this.stage + '**/*.html',
        fonts: 'bower_components/bootstrap/fonts/**/*.*',
        htmltemplates: clientApp + '**/*.html',
        images: client + 'images/**/*.*',
        index: client + 'index.html',
        js: [
            clientApp + '**/*.module.js',
            clientApp + '**/*.js',
            '!' + clientApp + '**/*.spec.js',
        ],
        css: client + 'styles/main.css',
        less: client + 'styles/styles.less',
        root: root,
        
        /**
         * templateCache
         */
        templateCache: {
            file: 'templates.js',
            options: {
                module: 'main',
                standAlone: false,
                root: 'app/'
            }
        },
        
        /**
         * Optimized Files
         */
        optimized: {
            app: 'app.js',
            lib: 'lib.js'
        },

        /**
         * Bower and NPM locations
         */
        bower: {
            json: require('./bower.json'),
            directory: './bower_components',
            ignorePath: '..'
        },
        packages: [
            './package.json',
            './bower.json'
        ]
    };

    config.getWiredepDefaultOptions = function () {
        var options = {
            bowerJson: config.bower.json,
            directory: config.bower.directory,
            ignorePath: config.bower.ignorePath
        };

        return options;
    };

    return config;
};
