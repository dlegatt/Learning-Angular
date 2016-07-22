(function() {
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

        $scope.$on('deleted',function(deleted,expense) {
            data.delExpense(expense);
        });

        $scope.$on('saved', function(){
            vm.both = data.getAll();
        })
    }
})();