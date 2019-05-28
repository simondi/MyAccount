angular.module('portal.filters.fullAddress').filter('fullAddress', function () {
    'use strict';

    return function (address) {
        var addr =  (address.streetNumber || '') + ' ' +
                    (address.streetName || '') + ' ' +
                    (address.cityName || '') + ', ' + (address.state || '') + ' ' +
                    (address.zipCode || '');
        return addr.trim();
    };
});
