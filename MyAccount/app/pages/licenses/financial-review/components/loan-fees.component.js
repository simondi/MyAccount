angular.module('portal.pages.licenses.financialReview').component('loanFees', {
    templateUrl: 'app/pages/licenses/financial-review/components/loan-fees.template.html',
    bindings: {
        review: '<',
        modelState: '<',
        definitions: '<'
    },
    controller: function () {
        'use strict';

        var $ctrl = this;

        $ctrl.defaultFeesTotal = function () {
            if (!$ctrl.review) {
                return 0;
            }
            return ($ctrl.review.dollarOfInterestCharged || 0) +
            ($ctrl.review.dollarAmountofDishonouredPaymentFees || 0);
        };
    }
});