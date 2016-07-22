(function() {
    angular.module('main')
        .directive('sortIcon',sortIcon);
    function sortIcon() {
        var directive = {
            restrict: 'E',
            templateUrl: 'app/sort-icon.html',
            scope: {
                column: '@',
                sort: '=',
                order: '='
            },
            replace: true,
            controller: SortIconController,
            controllerAs: 'vm',
            bindToController: true
        };
        return directive;
    }

    function SortIconController(){
        var vm = this;
        vm.log = function() {console.log(vm.column, vm.sort, vm.order);};
    }
})();