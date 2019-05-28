angular.module('portal.pages.userSettings')
    .controller('UserSettingsController', [
        'Confirm', 'currentUser', 'ngToast', function (Confirm, currentUser, ngToast) {
            'use strict';

            var ctrl = this;
            ctrl.user = currentUser;
            ctrl.message = '';

            ctrl.onChangeEmailClicked = function(formController) {
                ctrl.message = '';

                Confirm.showConfirm('Change Email', 'You\'re about to change the email address that you use to login. ' +
                        'The system also uses this email address to send password resets and other messages. ' +
                        'Are you sure you want to change your email address?', { okLabel: 'Change My Email Address' })
                    .then(function() {
                        ctrl.user.$save().then(function(user) {
                            IdentityCache.setIdentity(null);
                            IdentityCache.clearAccessTokens();
                            $state.go('login');
                        }).catch(function(response) {
                            ctrl.messages = AspNetHelpers.processValidationErrors(response);
                            ctrl.showResendButton = response.status === 401;
                        });
                    });
            };
        }
    ]);