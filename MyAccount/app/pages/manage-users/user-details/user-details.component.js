angular.module('portal.pages.manage-users')
    .component('userDetails', {
        restrict: 'E',
        bindings: {
            user: '<'
        },
        templateUrl: 'app/pages/manage-users/user-details/user-details.template.html',
        controller: ['User', 'Confirm', '$uibModal', function (User, Confirm, $uibModal) {
            'use strict';
            var ctrl = this;

            ctrl.onResetPasswordClicked = function () {
                Confirm.showConfirm('Reset Password', 'An email will be sent to the user with a reset link.')
                    .then(function () {
                        User.resetPassword({ email: ctrl.user.userName }).$promise
                        .then(function () {
                                Confirm.showConfirm('Done', 'The reset password email has been sent.', { showCancel: false });
                            })
                       .catch(function (response) {
                            Confirm.showConfirm('Error', 'There was an error sending the password reset link:' +
                                response.status + ', ' + response.statusText, { showCancel: false });
                        });
                    });
            };

            ctrl.setUserDisabled = function(isDiasbled) {
                User.disable({ id: ctrl.user.id, disable: isDiasbled }, {}).$promise
                    .then(function(updatedUser) {
                        ctrl.user.isDisabled = updatedUser.isDisabled;
                    })
                    .catch(function (response) {
                        Confirm.showConfirm('Error', 'There was an error updating the user. ' + response.status + ': ' + response.statusText,
                        { showCancel: false });
                    });
            };

            ctrl.onDisableClicked = function() {
                ctrl.setUserDisabled(true);
            };

            ctrl.onEnableClicked = function() {
                ctrl.setUserDisabled(false);
            };

            ctrl.onChangeEmailClicked = function() {
                var modal = $uibModal.open({
                    templateUrl: 'app/pages/manage-users/user-details/change-email.template.html',
                    controller: 'ChangeEmailController',
                    controllerAs: '$ctrl',
                    resolve: {
                        selectedUser: function() {
                            return ctrl.user;
                        }
                    }
                });

                modal.result.then(function(user) {
                    ctrl.user.userName = user.userName;
                });
            };
        }]
        
    });