angular.module('portal.pages.licenses.financialReview').component('loansByDollar', {
    templateUrl: 'app/pages/licenses/financial-review/components/loans-by-dollar.template.html',
    bindings: {
        review: '<',
        modelState: '<',
        definitions: '<'
    },
    controller: function () {
        'use strict';

        var $ctrl = this;

        $ctrl.totalLoansByDollar = function () {
            if (!$ctrl.review) {
                return 0;
            }
            return ($ctrl.review.numberLoans_0To500Dollars || 0) +
            ($ctrl.review.numberLoans_501To1000Dollars || 0) +
            ($ctrl.review.numberLoans_1001To1500Dollars || 0);
        };

        $ctrl.totalDollarLoansByDollar = function () {
            if (!$ctrl.review) {
                return 0;
            }
            return ($ctrl.review.dollarPrincipalOf0To500DollarLoans || 0) +
            ($ctrl.review.dollarPrincipalOf501To1000DollarLoans || 0) +
            ($ctrl.review.dollarPrincipalOf1001To1500DollarLoans || 0);
        };
    }
});