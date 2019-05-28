angular.module('portal.pages.licenses.financialReview').component('loanBorrowers', {
    templateUrl: 'app/pages/licenses/financial-review/components/loan-borrowers.template.html',
    bindings: {
        review: '<',
        modelState: '<',
        definitions: '<'
    },
    controller: function () {
        'use strict';
        var $ctrl = this;

        $ctrl.totalLoansByBorrower = function () {
            if (!$ctrl.review) {
                return 0;
            }
            return ($ctrl.review.numberOfBorrowersWithOneLoan || 0) +
            ($ctrl.review.numberOfBorrowersWith2To5Loans || 0) +
            ($ctrl.review.numberOfBorrowersWith6To10Loans || 0) +
            ($ctrl.review.numberOfBorrowersWith11To15Loans || 0) +
            ($ctrl.review.numberOfBorrowersWithGreaterThan15Loans || 0);
        };
    }
});