angular.module('portal.pages.passwordChange')
    .controller('PasswordChangeController', function(User, $state, $stateParams, AspNetHelpers, Confirm, IdentityCache) {
        'use strict';
        var ctrl = this;

        ctrl.password = '';
        ctrl.newPassword = '';
        ctrl.confirmNewPassword = '';
        ctrl.messages = ["Your password must be more than 6 characters in length and include the following: </br/> &nbsp;&nbsp;\t•  at least one symbol (i.e. #, $, %) </br/> &nbsp;&nbsp;\t•  at least one number </br/> &nbsp;&nbsp;\t•  at least one upper case letter\r\n"];
        ctrl.token = $stateParams.token;
        ctrl.userId = $stateParams.id;
        ctrl.isTokenRedeem = !!ctrl.token;
        ctrl.showResendButton = false;

        ctrl.onResendTokenClicked = function() {
            User.resetPassword({ userId: ctrl.userId }).$promise.then(function() {
                    Confirm.showConfirm('Done', 'Please check your email for a message with the reset link.', { showCancel: false })
                        .then(function() {
                            $state.go('login');
                        });
                })
                .catch(function(response) {
                    console.log(response);
                    ctrl.messages = [response.statusText];
                });
        };
        ctrl.onSubmitClicked = function() {
            ctrl.messages = [];
            ctrl.showResendButton = false;

            var payload = {
                id: ctrl.userId,
                newPassword: ctrl.newPassword,
                confirmNewPassword: ctrl.confirmNewPassword
            };
            if (ctrl.isTokenRedeem) {
                payload.token = ctrl.token;
                payload.tokenType = $stateParams.tokenType;
            } else {
                payload.password = ctrl.password;
                payload.id = IdentityCache.identity().id;
            }
            User.changePassword(payload).$promise.then(function() {
                Confirm.showConfirm('Password Changed', 'Your password has been succesfully changed. You will now be redirected to the login screen.', { showCancel: false })
                    .then(function() {
                        IdentityCache.setIdentity(null);
                        IdentityCache.clearAccessTokens();
                        $state.go('login');
                    });
            }).catch(function(response) {
                ctrl.messages = AspNetHelpers.processValidationErrors(response);
                ctrl.showResendButton = response.status === 401;
            });
        };
    });