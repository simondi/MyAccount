angular.module('portal.pages.licenses')
.controller('LicensesController', function($state, licenses, $uibModal, lodash) {
    'use strict';

    var ctrl = this;
    
    ctrl.title = 'Licenses List';
    ctrl.licenses = licenses;
    ctrl.itemsByPage = 10;
    ctrl.filter = { status: 'active' };

    ctrl.showEmployeesTab = false;
    ctrl.showAdminFeesTab = false;
    ctrl.showFinancialReviewTab = false;
    ctrl.showAggregateLoanDataTab = false;
    ctrl.showPreneedTab = false;
    ctrl.ShowDebt = false;
    ctrl.showTravelFinanceTab = false;

    ctrl.filterLicenses = function () {
        switch (ctrl.filter.status) {
            case 'all':
                ctrl.licenses = licenses;
                break;
            case 'active':
                ctrl.licenses = lodash.filter(licenses, function(license) {
                    return lodash.includes(['DUEPRT', 'ISSUED', 'NOTICE', 'NOTICE2', 'RENSUBD', 'TRANSFER'], license.licenseStatus);
                });
                break;
            case 'inactive':
                ctrl.licenses = lodash.filter(licenses, function (license) {
                    return lodash.includes(['EXPIRED','PENDING'], license.licenseStatus);
                });
                break;
        }
    };

    // The following are controlling tabs to show or to hide for different industries
    ctrl.checkTabs = function (licenseTypeSeq, businessType) {
        var licenseTypeSeqSet = [6, 20, 31];
        ctrl.showEmployeesTab = licenseTypeSeqSet.indexOf(licenseTypeSeq) >= 0;

        var licenseTypeSeqSet = [20];
        ctrl.showAdminFeesTab = licenseTypeSeqSet.indexOf(licenseTypeSeq) >= 0;

        var licenseTypeSeqSet = [6, 31];
        ctrl.showFinancialReviewTab = licenseTypeSeqSet.indexOf(licenseTypeSeq) >= 0;

        var licenseTypeSeqSet = [29];
        ctrl.showAggregateLoanDataTab = licenseTypeSeqSet.indexOf(licenseTypeSeq) >= 0;
        
        var licenseTypeSeqSet = [6, 31];    //debtCollection, DebtRepayment
        ctrl.ShowDebt = licenseTypeSeqSet.indexOf(licenseTypeSeq) >= 0;

        var licenseTypeSeqSet = [4, 20];    //Cemetery and Funeral service 
        ctrl.showPreneedTab = licenseTypeSeqSet.indexOf(licenseTypeSeq) >= 0;

        var licenseTypeSeqSet = [18];
        ctrl.showTravelFinanceTab = licenseTypeSeqSet.indexOf(licenseTypeSeq) >= 0 && businessType == "Head Office";
    };

    ctrl.filterLicenses();

    ctrl.licensesToRenew = function() {
        return lodash.filter(ctrl.licenses, ['isSelectedForRenewal', true]);
    };
    
    ctrl.onSelect = function (license, newValue) {
        if (newValue) {
            // This will reset all other selected rows, otherwise a preset row can get stuck.
            lodash.forEach(ctrl.licenses,
                function(value) {
                    if (value !== license) {
                        value.isSelected = false;
                    }
                });

            ctrl.checkTabs(license.licenseTypeSeq, license.business.businessType);

            // The following is modified because when a new license is selected, it should alwasyy check if the tab applies to the selected license.  
            var stateExist = ($state.$current.self.name === "licenses.preneed" && ctrl.showPreneedTab)
                            || ($state.$current.self.name === "licenses.adminFees" && ctrl.showAdminFeesTab)
                            || ($state.$current.self.name === "licenses.individuals" && ctrl.showEmployeesTab)
                            || ($state.$current.self.name === "licenses.financialReview" && ctrl.showFinancialReviewTab)
                            || ($state.$current.self.name === "licenses.travelFinance" && ctrl.showTravelFinanceTab)

            var destinationState = (!$state.$current || $state.$current.self.name === 'licenses' || !stateExist) ? 'licenses.details' : $state.$current.self.name;

            $state.go(destinationState, { 'id': license.licenseSeq });

            ctrl.checkTabs(license.licenseTypeSeq, license.business.businessType);
        }
    };

    ctrl.renew = function () {
        var cleanLicenses = lodash.each(ctrl.licensesToRenew(),
            function(license) {
                license.isSelected = false;
            });

        var headOfficeChecked = lodash.filter(cleanLicenses, ['business.businessType', 'Head Office']);
        var headOfficeRenewable = lodash.find(ctrl.licenses, ['business.businessType', 'Head Office']).isRenewable;

        if ( headOfficeChecked.length == 0  && headOfficeRenewable )
        {  // if the head office is NOT checked and head office is renewable 
            ctrl.onClickForPopup('app/pages/licenses/popup-HeadOffice_toInclude.html');
        }
        else
        {
            $state.go('renew', { licensesToRenew: cleanLicenses });
        }
    };

    ctrl.renewCheckboxClicked = function (event) {
        event.stopPropagation();
    };

    ctrl.backToLicenses = function() {
        $state.go('licenses');
    }

    ctrl.selectCurrentRow = function (paramId, license) {
        // Select current row based on state param. This should only occur after a page refresh
        if (paramId !== '' && parseInt(paramId) === license.licenseSeq && !license.isSelected) {
            lodash.find(ctrl.licenses, ['licenseSeq', parseInt(paramId)]).isSelected = true;
        }
    };

    ctrl.hasDiferentLicenseTypesSelected = function() {
        var groupedLicenses = lodash.groupBy(ctrl.licensesToRenew(), 'licenseTypeDesc');
        return Object.keys(groupedLicenses).length > 1;
    };

    //popup for all with different url content
    ctrl.onClickForPopup = function (url) {
        var modal = $uibModal.open({
            templateUrl: url,
            controller: 'PopupController',
            controllerAs: '$ctrl',
            size: 'lg'
        });
    };
});