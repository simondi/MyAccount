angular.module('portal.core.resources.license')
.factory('License', ['$resource', 'authSettings', function ($resource, authSettings) {
    'use strict';

    var License = $resource(
        authSettings.apiServiceBaseUri + 'api/License/:id',
        {
             id: '@licenseSeq'
        },
        {
            updateBusiness:
            {
                method: 'PUT',
                url: authSettings.apiServiceBaseUri + 'api/License/UpdateBusiness'
            },

            licenseTypes: {
                method: 'GET',
                url: authSettings.apiServiceBaseUri + 'api/License/types',
                isArray: true
            },

            licenseStatuses: {
                method: 'GET',
                url: authSettings.apiServiceBaseUri + 'api/License/statuses',
                isArray: true
            },

            funeralServicesAdminFees: {
                method: 'GET',
                url: authSettings.apiServiceBaseUri + 'api/License/:id/FuneralServiceAdminFees',
                isArray: true   
            }
        }
    );

    License.prototype.getContactFullName = function () {
        if (this.contactFirstName === null && this.contactLastName === null) {
            return '';
        }

        return this.contactFirstName + ' ' + this.contactLastName;
    };

    License.prototype.getLocationAddress = function () {
        return getFormattedAddress(this.business.location);
    };

    License.prototype.getMailingAddress = function () {
        return getFormattedAddress(this.business.mailingAddress);
    };

    License.prototype.getPhoneNumber = function () {
        if (this.business.phoneExtension === null) {
            return this.business.phoneNumber;
        }

        return this.business.phoneNumber + 'x' + this.business.phoneExtension;
    };

    License.prototype.getHeadOfficeAddress = function () {
        if (this.business.headOffice === null || this.business.headOffice.location) {
            return null;
        }

        return this.business.headOffice.location.streetNumber + ' ' +
            this.business.headOffice.location.streetName + ', ' +
            this.business.headOffice.location.cityName;
    };
    
    function getFormattedAddress(address) {
        if (address.streetNumber === null && address.streetName === null) {
            return '';
        }

        return (address.streetNumber ? address.streetNumber + ' ' : '') + address.streetName + ' ' + (address.streetSuffix || '') + '\n' +
            address.cityName + ', ' + address.state + '\n' +
            address.zipCode;
    }

    return License;
}]);