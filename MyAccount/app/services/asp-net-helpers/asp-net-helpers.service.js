angular.module('portal.services.aspNetHelpers').
    service('AspNetHelpers', function(lodash) {
        'use strict';

        return {
            processValidationErrors: function(response) {
                var result = lodash.flatMap(response.data, function (value) {
                    return lodash.map(value, 'ErrorMessage');
                });

                var newline = /\n/g;
                result = lodash.map(result, function(r) {
                    return r.replace(newline, '<br/>');
                });
                var tab = /\t/g;
                result = lodash.map(result, function (r) {
                    return r.replace(tab, '&nbsp;&nbsp;&nbsp;&nbsp;');
                });

                if (result.length === 0) {
                    result = [response.status + ': ' + response.statusText];
                }

                return result;
            }
        };
});