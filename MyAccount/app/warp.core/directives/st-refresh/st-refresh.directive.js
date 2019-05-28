angular.module('warp.directives.st-refresh')
    .directive('stRefresh', function () {
        'use strict';
        return {
            require: {
                table: 'stTable'
            },
            scope: false,
            link: {
                pre: function(scope, element, attrs, ctrl) {
                    var table = ctrl.table;
                    scope.tableRefresh = function () {
                        table.tableState().pagination.start = 0;
                        table.pipe();
                    };
                }
            }
        };
    });