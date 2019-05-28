angular.module('portal.pages.manage-users')
    .controller('MassCreateUsersController', [
        'User', '$uibModalInstance', 'Confirm', 'lodash', '$q',
        function(User, $uibModalInstance, Confirm, lodash, $q) {
            'use strict';

            var ctrl = this;

            ctrl.selectedBusinesses = [];
            ctrl.userId = '';

            function addBusinessToUser(businessId, userId) {
                var user = User.get({ id: userId });
                user.$promise.then(function () {
                    Confirm.showConfirm('Duplicate',
                        'A user already exists for the email address ' + user.userName + '. Would you like ' +
                        'to add the business with id ' + businessId + ' to the existing user?'
                    ).then(function () {
                        User.updateBusinesses({ id: userId }, [businessId]).$promise.catch(function (response) {
                            Confirm.showConfirm('Error',
                                'There was an error updating the businesses: ' + response.status + ': ' + response.statusText,
                                { showCancel: false }
                            );
                        });
                    });
                });
            }

            function createUserForBusiness(businessId) {
                var done = $q.defer();
                var promise = User.createForBusiness({ id: businessId }).$promise;
                promise.then(function (user) {
                    User.invite({ id: user.id }).$promise
                        .catch(function() {
                            Confirm.showConfirm('Error', 'There was an error sending the invitation email to the new user ' + user.id,
                            { showCancel: false });
                        });
                    done.resolve(true);
                }).catch(function(response) {
                    if (response.status === 409) {
                        // Conflict status code indicates a user with that ID exists
                        var existingUserId = response.statusText;
                        addBusinessToUser(businessId, existingUserId);
                    } else {
                        Confirm.showConfirm('Error',
                            'There was an error creating the user: ' + response.status + ': ' + response.statusText,
                            { showCancel: false }
                        );
                    }
                    done.resolve(false);
                });
                return done.promise;
            }

            ctrl.onOkClicked = function () {
                var promises = [];
                lodash(ctrl.selectedBusinesses).forEach(function(b) {
                    var done = createUserForBusiness(b);
                    promises.push(done);
                });

                $q.all(promises).then(function (resolved) {
                    var successCount = lodash(resolved).sumBy(function (n) { return n ? 1 : 0; });
                    Confirm.showConfirm('Finished', 'Created ' + successCount + ' new users.', { showCancel: false });
                    $uibModalInstance.close();
                });
            };

            ctrl.onCancelClicked = function() {
                $uibModalInstance.dismiss('cancel');
            };
        }
    ]);