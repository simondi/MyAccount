angular.module('portal.core.resources.order')
    .factory('Order', ['$resource', 'authSettings', function($resource, authSettings) {
        'use strict';
        var factory  = $resource(
            authSettings.apiServiceBaseUri + 'api/Order/:id',
            {id: '@id'},
            {
                processRenewal:
                {
                    method: 'POST',
                    url: authSettings.apiServiceBaseUri + 'api/Order/:id/RenewalPayment'
                },
                processAdminFee:
                {
                    method: 'POST',
                    url: authSettings.apiServiceBaseUri + 'api/Order/:id/AdminFeePayment'
                },
                processTafPayment:
                {
                method: 'POST',
                url: authSettings.apiServiceBaseUri + 'api/Order/:id/TAFPayment'
                }
            }
        );
        return factory;
    }]);