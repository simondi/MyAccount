angular.module('portal.pages.licenses.travelFinance')
    .service('TravelFinanceDefinitionService', function() {
        'use strict';

        this.d1A = 'Your financial end date is ';
        this.d1B = 'You can submit your financial report after this date ';

        this.d2A = 'Your financial end date is ';
        this.d2B = 'Your financial report needs to be submitted by ';
        this.d3B = 'in order to renew your license';


        this.d3 = 'Enter the total amount of gross sale.';
        this.d4 = 'The total amount of security required.';
        this.d5 = 'The total amount of security required.';
        this.d6 = 'Enter the total dollar amount of security you have.';
        this.d7 = 'Thedeficit of your security deposit.';
        this.d8 = 'Are you sure your business fiscal end date is worng? The page will be frozen if you answer yes and you have to contact Consumeprotection BC for the change.';
        this.d9 = 'The business fascal end date is pending change, please contact Consumer Protection BC for further details.';
        this.d10 = 'Are you sure your license type is worng? The page will be frozen if you answer yes and you have to contact Consumeprotection BC for the change.';
        this.d11 = 'The License Type is pending change, please contact Consumer Protection BC for further details.';
        this.d12 = 'Under the Travel Industry Regulation 13(1) all trust accounts must be located in British Columbia.';
    });