angular.module('portal.core.resources.role')
    .factory('Role', ['$resource', 'authSettings', function($resource, authSettings) {
        'use strict';
        return $resource(authSettings.apiServiceBaseUri + 'api/Role/:id');
    }]);