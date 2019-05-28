angular.module('portal.pages.licenses.financialReview').component('defaultedLoans', {
    templateUrl: 'app/pages/licenses/financial-review/components/defaulted-loans.template.html',
    bindings: {
        review: '<',
        modelState: '<',
        definitions: '<'
    }
});