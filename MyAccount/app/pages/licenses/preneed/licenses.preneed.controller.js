angular.module('portal.pages.licenses.preneed')
    .controller('LicensesPreneedController', function ($scope, $state, $stateParams, license, authSettings, lodash,
        $uibModal, License, Confirm) {
    'use strict';

        var ctrl = this;
        ctrl.title = 'Preneed Submission';
        ctrl.license = license;;
        ctrl.uploadInProgress = false;
        ctrl.preneedFiscalYear = '';
        ctrl.fiscalYears = [];
        ctrl.canUploadPreneed = false;

        ctrl.updateUploadUrl = function() {
            ctrl.uploadUrl = authSettings.apiServiceBaseUri + '/api/Document?licenseNumber=' + ctrl.license.licenseNumber +
                '&documentType=' + 'Licensing' +
                '&documentSubType=' + 'PN' +
                '&licenseTypeSeq=' + ctrl.license.licenseTypeSeq +
                '&fiscalYear=' + ctrl.preneedFiscalYear;
        };


        ctrl.init = function() {
            // This prevents digest from firing too many times

            ctrl.updateUploadUrl();

            ctrl.canUploadPreneed = license.licenseTypeDesc === 'Cemetery' || license.licenseTypeDesc === 'Funeral Services';

            $scope.$parent.ctrl.selectCurrentRow($stateParams.id, ctrl.license);

            // Get last two digits of the current year.
            var year = Number(new Date().getFullYear().toString());
            for (var i = 0; i < 6; i++) {
                var mydate = new Date((year - i).toString() + '/' + license.fiscalYearEnd);
                if (mydate < Date.now()) {
                    ctrl.fiscalYears.push('Fiscal Year End On ' + (year - i).toString() + '/' + license.fiscalYearEnd);
                }
            }
        };

        ctrl.init();

        ctrl.onFiscalYearChanged = function() {
            ctrl.updateUploadUrl();
        };


        ctrl.onUpload = function() {
            ctrl.uploadInProgress = true;
        };

        ctrl.onComplete = function() {
            ctrl.uploadInProgress = false;
        };

        ctrl.onSuccess = function () {
            ctrl.onClickForPopup('app/pages/licenses/preneed/submitPreneedSuccessful.html');
            //Confirm.showConfirm('Upload', 'The file was uploaded successfully.');
        };

        ctrl.onError = function(response) {
            Confirm.showConfirm('Error Uploading', response.status + ': ' + response.statusText);
        };

        //popup for all with different url content
        ctrl.onClickForPopup = function (url) {
            var modal4 = $uibModal.open({
                templateUrl: url,
                controller: 'PopupController',
                controllerAs: '$ctrl',
                size: 'lg'
            });
        };
    });