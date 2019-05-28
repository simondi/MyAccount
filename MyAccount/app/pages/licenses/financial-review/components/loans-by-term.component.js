angular.module('portal.pages.licenses.financialReview').component('loansByTerm', {
    templateUrl: 'app/pages/licenses/financial-review/components/loans-by-term.template.html',
    bindings: {
        review: '<',
        modelState: '<',
        definitions: '<'
    },
    controller: function () {
        'use strict';

        var $ctrl = this;

        $ctrl.totalLoansByTerm = function () {
            if(!$ctrl.review) {
                return 0;
            }
            return ($ctrl.review.numberOfOneToSevenDayLoans || 0) +
            ($ctrl.review.numberOf8To14DayLoans || 0) +
            ($ctrl.review.numberOf15To21DayLoans || 0) +
            ($ctrl.review.numberOf22To30DayLoans || 0) +
            ($ctrl.review.NumberOf31To62DayLoans || 0);
        };

        $ctrl.totalDollarLoansByTerm = function () {
            if(!$ctrl.review) {
                return 0;
            }
            return ($ctrl.review.dollarPrincipalOf1To7DayLoans || 0) +
            ($ctrl.review.dollarPrincipalOf8To14DayLoans || 0) +
            ($ctrl.review.dollarPrincipalOf15To21DayLoans || 0) +
            ($ctrl.review.dollarPrincipalOf22To30DayLoans || 0) +
            ($ctrl.review.dollarPrincipalOf31To62DayLoans || 0);
            };
        }
        });