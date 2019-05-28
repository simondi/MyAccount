angular.module('portal.pages.renew.renew-crematorium')
    .component('renewCrematorium', {
        bindings: {
            license: '<',
            renewalInfo: '<'
        },
        require: {
            renewForm: '^form'    
        },
        templateUrl: 'app/pages/renew/crematorium/renew-crematorium.template.html',
        controller: [function() {
            'use strict';
            
        }]
    });