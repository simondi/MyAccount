angular.module('portal.core.resources.user')
    .factory('User', ['$resource', 'authSettings', function($resource, authSettings) {
        'use strict';
        var resource = $resource(authSettings.apiServiceBaseUri + 'api/UserSummary/:id', { id: '@id' }, {

            query: {
                method: 'GET',
                isArray: true,
                interceptor: {
                    response: function(httpResponse) {
                        httpResponse.resource.userCount = httpResponse.headers()['user-count'];
                        httpResponse.resource.userPage = httpResponse.headers()['user-page'];
                        return httpResponse;
                    }
                }
            },

            create: {
                method: 'PUT',
                url: authSettings.apiServiceBaseUri + 'api/User'
            },

            // This is for mass creating users
            createForBusiness: {
                method: 'PUT',
                url: authSettings.apiServiceBaseUri + 'api/User/:id/massCreate'
            },

            invite: {
                method: 'POST',
                url: authSettings.apiServiceBaseUri + 'api/User/:id/invite'
            },

            businesses: {
                method: 'GET',
                isArray: true,
                url: authSettings.apiServiceBaseUri + 'api/User/:id/businessesSingle' 
            },

            updateBusinesses: {
                method: 'POST',
                url: authSettings.apiServiceBaseUri + 'api/User/:id/businesses'
            },

            searchBusinesses: {
                method: 'GET',
                isArray: true,
                url: authSettings.apiServiceBaseUri + 'api/User/businesses',
                interceptor: {
                    response: function(httpResponse) {
                        httpResponse.resource.businessCount = httpResponse.headers()['business-count'];
                        return httpResponse;
                    }
                }
            },

            removeBusinesses: {
                method: 'DELETE',
                url: authSettings.apiServiceBaseUri + 'api/User/:id/businesses'
            },

            changePassword: {
                method: 'POST',
                url: authSettings.apiServiceBaseUri + 'api/User/:id/ChangePassword'
            },

            changeEmail: {
                method: 'POST',
                url: authSettings.apiServiceBaseUri + 'api/User/:id/ChangeEmail'
            },

            changeUserInfo: {
                method: 'POST',
                url: authSettings.apiServiceBaseUri + 'api/User/ChangeUserInfo'
            },

            resetPassword: {
                method: 'POST',
                url: authSettings.apiServiceBaseUri + 'api/User/ResetPassword'
            },

            disable: {
                method: 'POST',
                url: authSettings.apiServiceBaseUri + 'api/User/:id/Disabled'
            }

        });

        return resource;
    }]);