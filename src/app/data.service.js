(function() {
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
                },
                {
                    merchant: 'Reggie\'s Deli',
                    amount: 15.23,
                    isInGroupA: false
                },
                {
                    merchant: 'Tran\'s Noodles',
                    amount: 7.74,
                    isInGroupA: false
                },
                {
                    merchant: 'Pepe\'s Tacos',
                    amount: 4.35,
                    isInGroupA: false
                },
                {
                    merchant: 'Fresh Feed',
                    amount: 54.32,
                    isInGroupA: false
                },
                {
                    merchant: 'Reflections',
                    amount: 25.00,
                    isInGroupA: false
                }

            ];

            var service = {
                getGroupA: getGroupA,
                getGroupB: getGroupB,
                getAll: getAll,
                declare: declare,
                saveExpense: saveExpense,
                delExpense: delExpense
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
                return groupA.concat(groupB);
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

            function saveExpense(expense)
            {
                groupB.push(expense);
            }

            function delExpense(expense)
            {
                var idx = groupB.indexOf(expense);
                if (idx > -1) {
                    groupB.splice(idx,1);
                }
            }
        });
})();
