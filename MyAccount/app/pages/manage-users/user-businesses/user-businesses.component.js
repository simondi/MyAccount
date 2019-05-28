angular.module('portal.pages.manage-users')
    .component('userBusinesses', {
        restrict: 'E',
        bindings: {
            user: '<'
        },
        templateUrl: 'app/pages/manage-users/user-businesses/user-businesses.template.html',
        controller: [
            'User', 'Confirm', 'lodash', '$uibModal', function(User, Confirm, lodash, $uibModal) {
                'use strict';
                var ctrl = this;

                ctrl.businesses = undefined;
                ctrl.selectedBusinesses = [];

                function loadBusinesses() {
                    ctrl.selectedBusinesses = [];
                    ctrl.businesses = User.businesses({ id: ctrl.user.id });
                }

                ctrl.$onChanges = function(changesObj) {
                    if (changesObj.user && changesObj.user.currentValue) {
                        loadBusinesses();
                    }
                };

                ctrl.licenseNumbers = function(business) {
                    if (!business.licenses) {
                        return '';
                    }

                    var distinct = lodash.chain(business.licenses).groupBy('licenseNumber').keys().value();
                    return distinct.join(', ');
                };

                ctrl.licenseTypes = function(business) {
                    if (!business.licenses) {
                        return '';
                    }

                    var distinct = lodash.chain(business.licenses).groupBy('licenseTypeDesc').keys().value();
                    return distinct.join(', ');
                };

                ctrl.onBusinessSelected = function(business) {
                    var idx = lodash(ctrl.selectedBusinesses).indexOf(business);
                    if (idx >= 0) {
                        ctrl.selectedBusinesses.splice(idx, 1);
                    } else {
                        ctrl.selectedBusinesses.push(business);
                    }
                };

                function businessesUpdated() {
                    loadBusinesses();
                    User.get({ id: ctrl.user.id }).$promise.then(function(updatedUser) {
                        ctrl.user.businesses = updatedUser.businesses;
                    });
                }

                ctrl.businessName = function (business) {
                    var result = business.businessName;
                    if (business.doesBusinessAs) {
                        result += ' (' + business.doesBusinessAs + ')';
                    }
                    return result;
                };

                ctrl.onRemoveSelected = function() {
                    var selectedNames = lodash(ctrl.selectedBusinesses).map('businessName');
                    var msg = 'You are about to remove access to the businesses: ' + selectedNames.join(', ');

                    var modal = Confirm.showConfirm('Remove Businesses', msg);

                    modal.then(function() {
                        var selectedIds = lodash(ctrl.selectedBusinesses).map('businessSeq').value();
                        var resource = User.removeBusinesses({ id: ctrl.user.id, 'businessIds[]': selectedIds });

                        resource.$promise.then(function() {
                                return Confirm.showConfirm('Success', 'The businesses were succesfully removed', { showCancel: false });
                            }, function(error) {
                                return Confirm.showConfirm('Error',
                                    'There was an error removing the businessess: ' + error.statusCode + ': ' + error.statusText,
                                    { showCancel: false });
                            })
                            .then(businessesUpdated);
                    });
                };

                ctrl.onClickAddBusiness = function() {
                    var modal = $uibModal.open({
                        templateUrl: 'app/pages/manage-users/add-business/add-business.template.html',
                        controller: 'AddBusinessController',
                        controllerAs: '$ctrl',
                        size: 'lg',
                        resolve: {
                            user: function() {
                                return ctrl.user;
                            },
                            businesses: function() {
                                return ctrl.businesses;
                            }
                        }
                    });

                    modal.result.then(function(selectedBusinessIds) {
                        User.updateBusinesses({ id: ctrl.user.id }, selectedBusinessIds).$promise.then(function() {
                                Confirm.showConfirm('Success',
                                    'Succesfully updated the businesses for ' + ctrl.user.userName,
                                    { showCancel: false }
                                ).then(businessesUpdated);
                            },
                            function(response) {
                                Confirm.showConfirm('Error',
                                    'There was an error updating the businesses: ' + response.status + ': ' + response.statusText,
                                    { showCancel: false }
                                );
                            });
                    });
                };
            }
        ]
    });