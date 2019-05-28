angular.module('portal.pages.manage-users')
    .controller('ChangeEmailController', ['selectedUser', 'User', '$uibModalInstance', 'Confirm',
        function (selectedUser, User, $uibModalInstance, Confirm) {
            'use strict';
            var ctrl = this;

            ctrl.user = angular.copy(selectedUser);

            ctrl.onOkClicked = function() {
                User.changeEmail({ id: ctrl.user.id, email: ctrl.user.userName }, {}).$promise
                    .then(function(updatedUser) {
                        Confirm.showConfirm('Success', 'The user\'s email has been changed', { showCancel: false });
                        $uibModalInstance.close(updatedUser);
                    })
                    .catch(function(response) {
                        if (response.status === 409) {
                            Confirm.showConfirm('Error', 'The specified email addres is used by a different user.', { showCancel: false });
                        } else {
                            Confirm.showConfirm('Error', 'There was an error changing the email address: ' + response.status + ', ' + response.statusText,
                            { showCancel: false });
                        }
                    });
            };

            ctrl.onCancelClicked = function() {
                $uibModalInstance.dismiss('cancel');
            };
        }
    ]);