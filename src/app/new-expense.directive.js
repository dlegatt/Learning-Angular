(function() {
    angular.module('main')
        .directive('newExpense',newExpense);
    function newExpense() {
        var directive = {
            restrict: 'EA',
            templateUrl: 'app/new-expense.html',
            controller: NewExpenseController,
            controllerAs: 'vm',
            bindToController: true,
            replace: true,
            scope: {}
        };
        return directive;
    }

    NewExpenseController.$inject = ['data','$scope'];

    function NewExpenseController(data,$scope) {
        var vm = this;
        vm.saveExpense = saveExpense;

        function saveExpense () {
            data.saveExpense(vm.expense);
            $scope.$emit('saved',vm.expense);
            vm.expense = angular.copy({});
        }
    }
})();
