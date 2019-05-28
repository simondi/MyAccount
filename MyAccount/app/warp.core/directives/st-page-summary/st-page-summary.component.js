angular.module('warp.directives.st-page-summary')
    .component('stPageSummary', {
        restrict: 'E',
        require: {
            tableCtrl: '^stTable'
        },
        bindings: {
            isLoading: '<'
        },
        template:
            '<span ng-show="$ctrl.totalNum > 0">' +
                '{{$ctrl.startNum}} - {{$ctrl.endNum}} of {{$ctrl.totalNum}}' +
            '</span>' +
            '<span ng-show="$ctrl.totalNum == 0">' +
                '0 users found' +
            '</span> &nbsp;' + 
            '<span ng-show="$ctrl.isLoading">' +
                '<i class="glyphicon glyphicon-refresh glyphicon-spin"></i>' +
            '</span>',
        controller: [
            '$scope', function($scope) {
				'use strict';
                var ctrl = this;
                $scope.$watch(function() {
                        return ctrl.tableCtrl.tableState().pagination;
                    },
                    function(newValue) {
                        if (newValue) {
                            ctrl.startNum = newValue.start + 1;
                            var numShown = Math.min(newValue.number, newValue.totalItemCount - newValue.start);
                            ctrl.endNum = newValue.start + numShown;
                            ctrl.totalNum = newValue.totalItemCount;
                        }
                    },
                    true);
            }
        ]
    });