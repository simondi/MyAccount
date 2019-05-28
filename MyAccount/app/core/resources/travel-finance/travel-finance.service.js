angular.module('portal.core.resources.travel-finance')
    .factory('TravelFinance', [
        '$resource', 'authSettings', function($resource, authSettings) {
            'use strict';

            return $resource(
                authSettings.apiServiceBaseUri + '/api/License/:licenseId/TravelFinance/:id',
                {
                    id: '@id',
                    licenseId: '@licenseId'
                },
                {
                    saveDraft: {
                        method: 'POST',
                        params: { postMode: 'saveDraft'}
                    },

                    checkForm: {
                        method: 'POST',
                        params: { postMode: 'validate' }
                    }
                });
        }
    ]);