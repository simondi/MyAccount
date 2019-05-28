
angular.module('portal.pages.renew.renew-telemarketer')
    .component('renewTelemarketer', {
        bindings: {
            renewalInfo: '<',
            service: '@'
        },
        templateUrl: 'app/pages/renew/telemarketer/renew-telemarketer.template.html',
        controller: [function() {
            'use strict';
        }]
    }); 