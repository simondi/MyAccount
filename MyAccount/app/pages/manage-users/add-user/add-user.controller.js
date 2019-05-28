angular.module('portal.pages.manage-users')
    .controller('AddUserController', [
        'User', '$uibModalInstance', 'Confirm',
        function(User, $uibModalInstance, Confirm) {
            'use strict';

            var ctrl = this;

            ctrl.selectedBusinesses = [];
            ctrl.userId = '';

            ctrl.addBusinessesToExistingUser = function (userId) {
                User.updateBusinesses({ id: userId }, ctrl.selectedBusinesses).$promise.then(function () {
                    Confirm.showConfirm('Success',
                        'Succesfully updated the businesses for ' + ctrl.userId,
                        { showCancel: false }
                    );
                },
                     function (response) {
                         Confirm.showConfirm('Error',
                             'There was an error updating the businesses: ' + response.status + ': ' + response.statusText,
                             { showCancel: false }
                         );
                     });
            };

            ctrl.onOkClicked = function() {
                var user = User.create({
                    userId: ctrl.userId,
                    businessIds: ctrl.selectedBusinesses
                });

                user.$promise
                    .then(function () {
                        Confirm.showConfirm('Success',
                            'Succesfully create the user ' + ctrl.userId + '. ' +
                            'Would you like to send an invitation email now?',
                            {
                                okLabel: 'Yes',
                                cancelLabel: 'No'
                            }
                        ).then(function() {
                            User.invite({ id: user.id });
                        }).finally(function() {
                            $uibModalInstance.close(user.id);
                        });
                    })
                    .catch(function (response) {
                        if (response.status === 409 && ctrl.selectedBusinesses.length > 0) {
                            // Conflict status code indicates a user with that ID exists
                            var existingUserId = response.statusText;
                            Confirm.showConfirm('Duplicate',
                                'A user already exists with the id ' + ctrl.userId + '. Would you like ' +
                                'to add the selected business to the existing user?'
                            ).then(function() {
                                ctrl.addBusinessesToExistingUser(existingUserId);
                                $uibModalInstance.close(existingUserId);
                            }).catch(function () {
                                $uibModalInstance.dismiss('cancel');
                            });
                        } else {
                            Confirm.showConfirm('Error',
                                'There was an error creating the user: ' + response.status + ': ' + response.statusText,
                                { showCancel: false }
                            );
                            $uibModalInstance.dismiss('cancel');
                        }
                    });
            };

            ctrl.onCancelClicked = function() {
                $uibModalInstance.dismiss('cancel');
            };
        }
    ]);