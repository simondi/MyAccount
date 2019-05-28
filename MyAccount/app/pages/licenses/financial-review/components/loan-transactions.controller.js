angular.module('portal.pages.licenses.financialReview').component('loanTransactions', {
    templateUrl: 'app/pages/licenses/financial-review/components/loan-transactions.template.html',
    bindings: {
        review: '<',
        modelState: '<',
        definitions: '<'
    }
});