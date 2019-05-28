angular.module('portal.core.resources.user')
    .factory('Version', ['$resource', function($resource) {
        'use strict';
        return $resource('app/assets/json/version.json');
    }]);