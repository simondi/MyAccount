angular.module('portal.pages.renew.renew-funeral')
    .component('renewFuneral', {
        bindings: {
            license: '<',
            renewalInfo: '<'
        },
        templateUrl: 'app/pages/renew/funeral/renew-funeral.template.html',
        controller: [function() {
            'use strict';
        }]
    }); 