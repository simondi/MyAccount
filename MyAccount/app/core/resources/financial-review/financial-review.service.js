angular.module('portal.core.resources.financial-review')
    .factory('FinancialReview', [
        '$resource', 'authSettings', function($resource, authSettings) {
            'use strict';

            return $resource(
                authSettings.apiServiceBaseUri + '/api/License/:licenseId/PaydayLenderFinancialReviews/:id',
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