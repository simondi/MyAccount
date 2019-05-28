angular.module('portal.components.login-modal')
    .component('loginModal', {
        templateUrl: 'app/components/login-modal/login-modal.component.template.html',
        bindings: {
            close: '&',
            dismiss: '&'
        },
        controller: [
            '$state', function($state) {
                'use strict';
                var $ctrl = this;

                $ctrl.forgotPassword = function(userName) {
                    $ctrl.dismiss();
                    $state.go('forgot-password', { email: userName });
                };

                $ctrl.loginSucceeded = function() {
                    $ctrl.close();
                };

            }
        ]
    });