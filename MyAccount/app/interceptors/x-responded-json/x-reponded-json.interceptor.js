angular.module('portal.interceptors.xRespondedJson')
    .factory('XRespondedJson', function($q) {
    'use strict';
    return {
        response: function(response) {
            var headers = response.headers();
            if (headers['x-responded-json']) {
                var jsonResponse = angular.fromJson(headers['x-responded-json']);
                if (jsonResponse && jsonResponse.status >= 400) {
                    response.status = jsonResponse.status;
                    return $q.reject(response);
                }
            }
            return response;
        }
    };
});