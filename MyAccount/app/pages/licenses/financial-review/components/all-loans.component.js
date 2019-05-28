angular.module('portal.pages.licenses.financialReview').component('allLoans', {
    templateUrl: 'app/pages/licenses/financial-review/components/all-loans.template.html',
    bindings: {
        review: '<',
        modelState: '<',
        definitions: '<'
    }
});