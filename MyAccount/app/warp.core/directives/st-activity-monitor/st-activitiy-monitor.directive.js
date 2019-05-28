angular.module('warp.directives.st-activity-monitor')
    .directive('activityMonitor', ['$window', '$timeout', function ($window, $timeout) {
        'use strict';

        var lastCallback = new Date().getTime();
        var callbackPending = false;

        var activityDetected = function ($scope) {
            var time = new Date().getTime();
            var delta = (time - lastCallback);
            var delay = Math.max(0, ($scope.activityQuietSeconds * 1000) - delta);

          //  if (!callbackPending) {
          //      $timeout(function () {
          //          $scope.callback();
          //          lastCallback = new Date().getTime();
          //          callbackPending = false;
          //      }, delay);

          //      callbackPending = true;
          //  }
        };

        return {
            restrict: 'AE',
            scope: {
                activityQuietSeconds: '@',
                callback: '&activityMonitor'
            },
            link: function ($scope) {
                var win = angular.element($window);
                win.bind('click', function () {
                    activityDetected($scope);
                });
                win.bind('focusin', function () {
                    activityDetected($scope);
                });
                win.bind('focusout', function () {
                    activityDetected($scope);
                });
            }
        };

    }]);