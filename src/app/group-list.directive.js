(function() {
    angular.module('main')
        .directive('expenseTable',expenseTable);

    function expenseTable()
    {
        var directive = {
            restrict: 'E',
            templateUrl: 'app/expense-table.html',
            scope: {
                expenses: '=',
                declarative: '=?',
                searchable: '=?'
            },
            controller: ExpenseTableController,
            controllerAs: 'vm',
            bindToController: true,
            replace: true
        };
        return directive;
    }
    ExpenseTableController.$inject = ['$scope','$filter'];
    function ExpenseTableController($scope,$filter) {
        var vm = this;

        vm.declare = declare;
        vm.del = del;
        vm.paginate = paginate;
        vm.search = search;
        vm.showPager = showPager;

        vm.declarative = declarative();
        vm.searchable = searchable();
        vm.totalItems = vm.expenses.length;
        vm.currentPage = 1;
        vm.numPerPage = 5;
        vm.order = false;
        vm.sort = 'merchant';

        function paginate(item) {
            var begin;
            var end;
            var index;
            var expenses = vm.search();
            begin = (vm.currentPage -1) * vm.numPerPage;
            end = begin + vm.numPerPage;
            index = expenses.indexOf(item);
            return (begin <= index && index < end);
        }

        function search() {
            var filtered;
            filtered = $filter('orderBy')(vm.expenses,vm.sort,vm.order);
            return filtered;
        }

        function showPager()
        {
            if (vm.currentPage > 1) {
                return true;
            }
            return vm.search().length > vm.numPerPage;
        }

        function declarative(){
            return typeof vm.declarative === 'undefined' ? true : vm.declarative;
        }

        function searchable() {
            return typeof vm.searchable === 'undefined' ? true : vm.searchable;
        }
        function declare(expense) {
            removeFromCollection(expense);
            $scope.$emit('moved',expense);
        }
        function del(expense) {
            if(expense.isInGroupA) {
                return;
            }
            removeFromCollection(expense);
            $scope.$emit('deleted',expense);
        }

        function removeFromCollection(expense) {
            var idx = vm.expenses.indexOf(expense);
            if (idx > -1) {
                vm.expenses.splice(idx,1);
            }
        }
    }
})();