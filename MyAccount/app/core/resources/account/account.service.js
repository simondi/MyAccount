angular.module('portal.core.resources.account')
.factory('Account', ['$http', 'authSettings', 'IdentityCache', function ($http, authSettings, IdentityCache) {
    'use strict';

    var urlEncodeData = function(data) {
        var str = [];
        for (var p in data) {
            str.push(encodeURIComponent(p) + '=' + encodeURIComponent(data[p]));
        }
        return str.join('&');
    };

    return {
        login: function(email, password, domain) {
            var promise = $http({
                method: 'POST',
                url: authSettings.apiServiceBaseUri + 'Token',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                transformRequest: urlEncodeData,
                data: { username: email, password: password, domain: domain, grant_type: 'password' }
            });

            promise.then(function (result) {
                IdentityCache.setAccessTokens(result.data.access_token);
            }).catch(function (result) {
                console.log(result);
            });

            return promise;
        },

        logout: function () {
            return $http({
                method: 'POST',
                url: authSettings.apiServiceBaseUri + 'api/Account/Logout'
            }).then(function () {
                IdentityCache.setIdentity(null);
                IdentityCache.clearAccessTokens();
            });
        },

        identity: function() {
            var result = $http({
                method: 'GET',
                url: authSettings.apiServiceBaseUri + 'api/Account/Identity'
            });

            result.then(function(identity) {
                IdentityCache.setIdentity(identity.data);
            });

            result.catch(function () {
                IdentityCache.setIdentity(null);
            });

            return result;
        }
    };
}]);