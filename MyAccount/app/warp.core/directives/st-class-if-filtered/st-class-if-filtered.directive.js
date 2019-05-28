angular.module('warp.directives.st-class-if-filtered').directive('stClassIfFiltered', function ($parse) {
    'use strict';
    'ngInject';
    return {
        restrict: 'A',
        require: '^stTable',
        link: function ($scope, element, attributes, tableController) {
            if (!attributes.stSearch) {
                throw new Error('st-class-if-filtered directive requires st-search directive on same element.');
            }

            var searchTermGetter = $parse(attributes.stSearch);
            var className = attributes.stClassIfFiltered;

            $scope.$watch(function () {
                return tableController.tableState();
            },
                function (tableState) {
                    element.removeClass(className);
                    if (tableState && tableState.search && tableState.search.predicateObject) {
                        if (searchTermGetter(tableState.search.predicateObject)) {
                            element.addClass(className);
                        }
                    }
                },
                true);
        }
    };
});