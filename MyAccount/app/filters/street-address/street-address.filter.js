angular.module('portal.filters.streetAddress').filter('streetAddress', function () {
    'use strict';

    return function (address) {
        var addr = (address.streetNumber || '') + ' ' + (address.streetName || '');
        return addr.trim();
    };
});
