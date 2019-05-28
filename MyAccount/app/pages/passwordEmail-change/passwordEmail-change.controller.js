angular.module('portal.pages.passwordEmailChange')
    .controller('PasswordEmailChangeController', function (User, $state, $stateParams, AspNetHelpers, Confirm, IdentityCache) {
        'use strict';

        var ctrl = this;
        ctrl.email = '';
        ctrl.newEmail = '';
        ctrl.confirmEmail = '';
        ctrl.messages = ["Your password must be more than 6 characters in length and include the following: </br/> &nbsp;&nbsp;\t•  at least one symbol (i.e. #, $, %) </br/> &nbsp;&nbsp;\t•  at least one number </br/> &nbsp;&nbsp;\t•  at least one upper case letter\r\n"];
        ctrl.token = $stateParams.token;
        ctrl.userId = $stateParams.id;
        ctrl.isTokenRedeem = !!ctrl.token;
        ctrl.showResendButton = false;

       
        ctrl.onSubmitClicked = function() {
            ctrl.messages = [];
            ctrl.showResendButton = false;

            var payload = {
                id: ctrl.userId,
                email: ctrl.newEmail,
            };
            if (ctrl.isTokenRedeem) {
                payload.token = ctrl.token;
                payload.tokenType = $stateParams.tokenType;
            } else {
                    payload.id = IdentityCache.identity().id;
            }
            User.changeEmail(payload).$promise.then(function () {
                Confirm.showConfirm('Update Username', 'Your email has been changed. '+
                    'You will be redirected to login with your new email username. ', { showCancel: false })
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