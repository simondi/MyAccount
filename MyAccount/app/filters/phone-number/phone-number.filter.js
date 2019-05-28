angular.module('portal.filters.phoneNumber').filter('phoneNumber', function () {
    'use strict';

    return function (phoneNumber) {
        if (!phoneNumber) { return ''; }

        var splitNumber = phoneNumber.toString().trim().replace(/^\+/, '').split('x');

        var value = splitNumber[0];

        var extension = splitNumber[1] ? ' x' + splitNumber[1] : '';

        if (value.match(/[^0-9]/)) {
            return phoneNumber;
        }

        var country, city, number;

        switch (value.length) {
            case 10: // +1PPP####### -> C (PPP) ###-####
                country = 1;
                city = value.slice(0, 3);
                number = value.slice(3);
                break;

            case 11: // +CPPP####### -> CCC (PP) ###-####
                country = value[0];
                city = value.slice(1, 4);
                number = value.slice(4);
                break;

            case 12: // +CCCPP####### -> CCC (PP) ###-####
                country = value.slice(0, 3);
                city = value.slice(3, 5);
                number = value.slice(5);
                break;

            default:
                return phoneNumber;
        }

        if (country === 1) {
            country = '';
        }

        number = number.slice(0, 3) + '-' + number.slice(3);

        return (country + ' (' + city + ') ' + number + extension).trim();
    };
});
