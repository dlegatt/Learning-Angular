(function() {
    angular.module('main',['ngAnimate']);

    angular.module('main')
        .controller('MainController', MainController);
// Controller
    MainController.$inject = ['data','$scope'];

    function MainController(data,$scope)
    {
        var vm = this;
        vm.groupA = data.getGroupA();
        vm.groupB = data.getGroupB();
        vm.both = data.getAll();

        $scope.$on('moved',function(moved,expense) {
            data.declare(expense);
        });
    }

// Group list directive
    angular.module('main')
        .directive('expenseTable',expenseTable);

    function expenseTable()
    {
        var directive = {
            restrict: 'E',
            templateUrl: 'expense-table.html',
            scope: {
                expenses: '=',
                declarative: '=?'
            },
            controller: ExpenseTableController,
            controllerAs: 'vm',
            bindToController: true,
            replace: true
        };
        return directive;
    }
    function ExpenseTableController($scope) {
        var vm = this;
        vm.declarative = declarative();
        vm.declare = declare;

        function declarative(){
            return typeof vm.declarative === 'undefined' ? true : vm.declarative;
        }
        function declare(expense) {
            var idx = vm.expenses.indexOf(expense);
            if (idx > -1) {
                vm.expenses.splice(idx,1);
                $scope.$emit('moved',expense);
            }
        }
    }

// Expense Directive
    angular.module('main')
        .directive('expense',expense);

    function expense() {
        var directive = {
            restrict: 'A',
            templateUrl: 'expense.html',
            scope: {
                exp: '=',
                dec: '&',
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

// Data service
    angular.module('main')
        .factory('data',function() {
        var groupA = [
            {
                merchant: 'Bob\'s Burgers',
                amount: 5.87,
                isInGroupA: true
            }
        ];
        var groupB = [
            {
                merchant: 'Jimmy Pesto\'s',
                amount: 8.37,
                isInGroupA: false
            }
        ];
        var all = groupA.concat(groupB);
        
        var service = {
            getGroupA: getGroupA,
            getGroupB: getGroupB,
            getAll: getAll,
            declare: declare
        };
        return service;

        function getGroupA()
        {
            return groupA;
        }

        function getGroupB()
        {
            return groupB;
        }

        function getAll()
        {
            return all;
        }

        function declare(expense)
        {
            if (expense.isInGroupA) {
                expense.isInGroupA = false;
                groupB.push(expense);
                return expense;
            }
            expense.isInGroupA = true;
            groupA.push(expense);
            return expense;
        }
    });
})();