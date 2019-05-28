angular.module('portal.pages.renew.renew-summary')
    .component('renewSummary', {
        bindings: {
            licenses: '<'
        },
        templateUrl: 'app/pages/renew/summary/renew-summary.template.html',
        controller: [
            function() {
                'use strict';

                var ctrl = this;
                ctrl.businessChangeFormLink = function (license) {
                    switch (license.licenseTypeDesc.toUpperCase()) {
                    case 'CREMATORIUM':
                        return "https://www.consumerprotectionbc.ca/quick-links-businesses/change-licence-information/";
                    case 'CEMETERY':
                        return 'https://www.consumerprotectionbc.ca/quick-links-businesses/change-licence-information/';
                    case 'FUNERAL SERVICES':
                        return 'https://www.consumerprotectionbc.ca/quick-links-businesses/change-licence-information/';
                    case 'TELEMARKETER':
                        return 'https://www.consumerprotectionbc.ca/quick-links-businesses/change-licence-information/';
                    case 'TRAVEL AGENT':
                        return 'https://www.consumerprotectionbc.ca/quick-links-businesses/change-licence-information/';
                    case 'PAYDAY LENDER':
                        return 'https://www.consumerprotectionbc.ca/quick-links-businesses/change-licence-information/';
                    case 'DEBT COLLECTION':
                        return 'https://www.consumerprotectionbc.ca/quick-links-businesses/change-licence-information/';
                    case 'DEBT REPAYMENT':
                        return 'https://www.consumerprotectionbc.ca/quick-links-businesses/change-licence-information/';
                    default:
                        return 'https://www.consumerprotectionbc.ca/quick-links-businesses/change-licence-information/';
                    }
                };

            }
        ]
    });
