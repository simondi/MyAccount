angular.module('portal.pages.manage-users')
    .directive('selectedBusinessFormatter', ['lodash', function (lodash) {
        'use strict';
        // Directive that adds formatters and parsers to a model
        // linked to a checkbox control. The checkbox will add/remove the 
        // ID of a business to an array in the controller.
        return {
            scope: true,
            require: 'ngModel',
            link: function (scope, element, attrs, modelCtrl) {
                modelCtrl.$formatters.push(function (value) {
                    return lodash(value).includes(Number(attrs.selectedBusinessFormatter));
                });
                modelCtrl.$parsers.push(function (value) {
                    if (value) {
                        return lodash(modelCtrl.$modelValue).concat(Number(attrs.selectedBusinessFormatter)).value();
                    } else {
                        return lodash(modelCtrl.$modelValue).without(Number(attrs.selectedBusinessFormatter)).value();
                    }
                });
            }
        };
    }])

    .component('businessSearch', {
        templateUrl: 'app/pages/manage-users/business-search/business-search.template.html',
        bindings: {
            selectedBusinesses: '=',
            searchOptions: '<'
        },
        controller: [
            'License', 'User', 'manageUserViewPrefs', 'lodash', function(License, User, manageUserViewPrefs, lodash) {
                'use strict';
                var ctrl = this;
                ctrl.isRefreshing = false;
                ctrl.supressRefresh = true;
                ctrl.allSelected = false;

                ctrl.itemsPerPage = manageUserViewPrefs.businessesPerPage;
                ctrl.search = {
                    startIdx: 0
                };
                
                ctrl.licenseTypes = License.licenseTypes();
                ctrl.licenseTypes.$promise.then(function(licenseTypes) {
                    licenseTypes.unshift({ description: '', id: 0 });
                    ctrl.search.licenseTypeId = licenseTypes[0].id;
                });

                ctrl.licenseStatuses = License.licenseStatuses();
                ctrl.licenseStatuses.$promise.then(function(licenseStatuses) {
                    licenseStatuses.unshift({ description: '', code: '' });
                    ctrl.search.licenseStatusCode = licenseStatuses[0].code;
                });

                ctrl.businessName = function(business) {
                    var result = business.businessName;
                    if (business.doesBusinessAs) {
                        result += ' (' + business.doesBusinessAs + ')';
                    }
                    return result;
                };

                ctrl.licenseNumbers = function(business) {
                    return lodash(business.licenses).groupBy('licenseNumber').keys().join(', ');
                };

                ctrl.licensTypes = function(business) {
                    return lodash(business.licenses).groupBy('licenseTypeDesc').keys().join(', ');
                };

                ctrl.licensStates = function(business) {
                    return lodash(business.licenses).groupBy('licenseStatus').keys().join(', ');
                };

                ctrl.onSearchClicked = function (tableRefresh) {
                    tableRefresh();
                };

                function areAllBusinessesSelected() {
                    var ids = lodash(ctrl.businesses).map('businessSeq').value();
                    if (ids.length === 0) {
                        return false;
                    }

                    return lodash(ids).every(function (id) {
                        return lodash(ctrl.selectedBusinesses).includes(id);
                    });
                }

                ctrl.selectAll = function() {
                    var ids = lodash(ctrl.businesses).map('businessSeq').value();
                    if (areAllBusinessesSelected()) {
                        ctrl.selectedBusinesses = lodash(ctrl.selectedBusinesses).difference(ids).value();
                    } else {
                        ctrl.selectedBusinesses = lodash(ctrl.selectedBusinesses).union(ids).value();
                    }
                };
                
                ctrl.refreshBusinesses = function (tableState) {
                    if (ctrl.supressRefresh) {
                        // Supress the first call to refresh. This comes from the Smart Table controller
                        // and will populate the table before any search criteria are selected.
                        ctrl.supressRefresh = false;
                        return;
                    }
                    
                    var pagination = tableState.pagination;
                    ctrl.search.startIdx = pagination.start || 0;
                    ctrl.search.count = pagination.number || manageUserViewPrefs.businessesPerPage;
                    ctrl.search.withoutUsers = ctrl.searchOptions && ctrl.searchOptions.withoutUsers;
                    ctrl.search.withEmail = ctrl.searchOptions && ctrl.searchOptions.withEmail;

                    ctrl.isRefreshing = true;
                    User.searchBusinesses(ctrl.search).$promise.then(function (data) {
                        ctrl.isRefreshing = false;
                        tableState.pagination.totalItemCount = data.resource.businessCount;
                        tableState.pagination.numberOfPages = Math.ceil(data.resource.businessCount / ctrl.search.count);
                        ctrl.businesses = data.resource;
                        ctrl.allSelected = areAllBusinessesSelected();
                    }).catch(function () {
                        ctrl.isRefreshing = false;
                    });
                };
            }
        ]
    });