angular.module('warp.directives.confirm-exit')
    .directive('confirmExit', function ($state, $window, Confirm) {
        'use strict';
        'ngInject';

        var changingState = false;

        return {
            restrict: 'A',
            require: '^form',
            link: function ($scope, element, attributes, formController) {
                var message = attributes.confirmExit;
                var templateUrl = attributes.confirmExitTemplateUrl;

                $window.onbeforeunload = function (e) {
                    if (formController.$dirty) {
                        e.returnValue = message;
                        return message;
                    }
                };

                $scope.$on('$stateChangeStart', function(event, toState, toParams) {
                    if (formController.$dirty && !changingState) {
                        event.preventDefault();
                        var opts = { templateUrl: templateUrl };
                        var promise = Confirm.showConfirm('Unsaved Changes', message, opts);
                        promise.then(function() {
                            changingState = true;
                            try {
                                formController.$setPristine(true);
                                $state.go(toState, toParams);
                            }
                            finally {
                                changingState = false;
                            }
                        });
                    }
                });
            }
        };
    });