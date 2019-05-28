angular.module('portal.interceptors.oauthToken')
    .factory('OAuthTokenInterceptor', function($q, IdentityCache) {
    'use strict';
    return {
        request: function (req) {
            var token = IdentityCache.getAccessToken();
            if (token) {
                req.headers.authorization = 'Bearer ' + token;
            }
            return req;
        }
    };
});