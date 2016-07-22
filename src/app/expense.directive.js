(function() {
    // Expense Directive
    angular.module('main')
        .directive('expense',expense);

    function expense() {
        var directive = {
            restrict: 'A',
            templateUrl: 'app/expense.html',
            scope: {
                exp: '=',
                onDec: '&',
                onDel: '&',
                showDeclareBtn: '='
            },
            controller: ExpenseController,
            controllerAs: 'vm',
            bindToController: true,
            replace: true
        };
        return directive;
    }

    function ExpenseController() {
        var vm = this;
    }
})();