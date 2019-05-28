angular.module('portal.pages.forgotPassword')
    .controller('ForgotPasswordController', function(User, $state, $stateParams, Confirm) {
        'use strict';
        var ctrl = this;

        ctrl.email = $stateParams.email;
        ctrl.message = '';

        ctrl.onPasswordResetClicked = function() {
            Confirm.showConfirm('Reset Password', 'An email will be sent to the user with a reset link, if the user exists')
                .then(function() {
                    User.resetPassword({ email: ctrl.email }).$promise.then(function() {
                            Confirm.showConfirm('Done', 'Please check your email for a message with the reset link.', { showCancel: false })
                                .then(function() {
                                    $state.go('login');
                                });
                        })
                        .catch(function(response) {
                            console.log(response);
                            ctrl.message = response.statusText;
                        });
                })
                .catch(function () {
                    ctrl.message = 'Error showing confirmation';
                });
        };

    });