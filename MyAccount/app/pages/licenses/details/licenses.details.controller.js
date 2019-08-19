angular.module('portal.pages.licenses.details')
.controller('LicensesDetailsController', function ($scope, $state, $stateParams, license, authSettings, lodash, License, Confirm) {
    'use strict';

    var ctrl = this;
    ctrl.title = 'License Details';
    ctrl.license = license;
    ctrl.isEditing = false;
    ctrl.saveWasSuccessful = false;
    ctrl.saveError = '';

    ctrl.init = function () {
        // This prevents digest from firing too many times
        ctrl.contactFullName = license.getContactFullName();
        ctrl.locationAddress = license.getLocationAddress();
        ctrl.mailingAddress = license.getMailingAddress();
        ctrl.headOfficeAddress = license.getHeadOfficeAddress();
        ctrl.phoneNumber = license.getPhoneNumber();

        $scope.$parent.ctrl.selectCurrentRow($stateParams.id, ctrl.license);
    };

    ctrl.init();

    ctrl.initEdit = function () {
        ctrl.originalLicense = angular.copy(ctrl.license);
        ctrl.saveWasSuccessful = false;
        ctrl.saveError = '';
        ctrl.isEditing = true;
    };


    ctrl.save = function () {
        License.updateBusiness(ctrl.license).$promise
            .then(function () {
                ctrl.isEditing = false;
                ctrl.saveWasSuccessful = true;
                ctrl.init();
            })
            .catch(function (response) {
                console.log(response);
                ctrl.saveError = 'Error ' + response.status + ': ' + response.statusText;
            });
    };

    ctrl.reset = function () {
        ctrl.saveWasSuccessful = false;
        ctrl.saveError = '';
        ctrl.isEditing = false;
        ctrl.license = angular.copy(ctrl.originalLicense);
    };

    ctrl.backToLicenses = function () {
        $state.go('licenses');
    }

    ctrl.renew = function () {
        ctrl.license.isSelected = false;
        $state.go('renew', { licensesToRenew: [ctrl.license] });
    };
});