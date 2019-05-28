// Use on a <tr> element along with st-select-row and to have a function
// called when selection state for a row changes.
// eg. <tr st-select-row="row" select-notifier="onSelect" ng-repeat="row in displayed">...</tr>

angular.module('warp.directives.st-select-notifier')
    .directive('stSelectNotifier', function () {
        'use strict';
        return {
            scope: false, // use parent scope
            restrict: 'A',
            link: function (scope, elm, attrs) {
                var rowAttr = attrs.stSelectRow;
                var procAttr = scope.$eval(attrs.stSelectNotifier);
                if (rowAttr && procAttr && typeof (procAttr) === 'function') {
                    scope.$watch(rowAttr + '.isSelected', function (newValue, oldValue) {
						procAttr(scope[rowAttr], newValue, oldValue);
                    });
                }
            }
        };
    });