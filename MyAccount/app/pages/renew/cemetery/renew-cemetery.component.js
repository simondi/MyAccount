angular.module('portal.pages.renew.renew-cemetery')
    .component('renewCemetery', {
        bindings: {
            license: '<',
            renewalInfo: '<'
        },
        require: {
            renewForm: '^form'
        },
        templateUrl: 'app/pages/renew/cemetery/renew-cemetery.template.html',
        controller: [function() {
            'use strict';

            var ctrl = this;
            ctrl.totalInternments = function () {
                var human = Number(ctrl.renewalInfo.internmentsHuman) || 0;
                var cremated = Number(ctrl.renewalInfo.internmentsCremated) || 0;

                return human + cremated;
            };
        }]
    }); 