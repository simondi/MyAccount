angular.module('portal.pages.emailChange')
    .controller('EmailChangeController', function (User, $state, $stateParams, AspNetHelpers, Confirm, IdentityCache) {
        'use strict';

        var ctrl = this;
        ctrl.email = '';
        ctrl.newEmail = '';
        ctrl.confirmEmail = '';
        ctrl.messages = [];
        ctrl.token = $stateParams.token;
        ctrl.userId = $stateParams.id;
        ctrl.isTokenRedeem = !!ctrl.token;
        ctrl.showResendButton = false;

        ctrl.onChangeEmailClicked = function (formController) {
            alert('Worked!');
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
                Confirm.showConfirm('Change Email', 'You\'re about to change the email address that you use to login. ' +
                    'The system also uses this email address to send password resets and other messages. ' +
                    'Are you sure you want to change your email address?', { okLabel: 'OK' })
                    .then(function () {
                        IdentityCache.setIdentity(null);
                        IdentityCache.clearAccessTokens();
                        $state.go('login');
                    });
            }).catch(function (response) {
                ctrl.messages = AspNetHelpers.processValidationErrors(response);
                ctrl.showResendButton = response.status === 401;
            });
        };
    });