angular.module('portal.pages.licenses.financialReview').component('ancillaryProducts', {
    templateUrl: 'app/pages/licenses/financial-review/components/ancillary-products.template.html',
    bindings: {
        review: '<',
        modelState: '<',
        definitions: '<'
    },
    controller: function () {
        'use strict';

        var $ctrl = this;

        $ctrl.ancillaryNumTotal = function () {
            if (!$ctrl.review) {
                return 0;
            }
            return ($ctrl.review.numberOfDebitCardsIssued || 0) +
            ($ctrl.review.numberOfCreditCardsIssued || 0) +
            ($ctrl.review.numberOfBankAccountsSold || 0) +
            ($ctrl.review.numberOfInsurancePoliciesSold || 0);
        };

        $ctrl.ancillaryDollarsTotal = function () {
            if (!$ctrl.review) {
                return 0;
            }
            return ($ctrl.review.dollarOfDebitCardsIssued || 0) +
            ($ctrl.review.dollarOfCreditCardsIssued || 0) +
            ($ctrl.review.dollarOfBankAccountsSold || 0) +
            ($ctrl.review.dollarOfInsurancePoliciesSold || 0);
        };
    }
});