angular.module('portal.pages.licenses.travelFinance').component('travelAgent', {
    templateUrl: 'app/pages/licenses/travel-finance/components/travel-agent.template.html',
    bindings: {
        review: '<',
        modelState: '<',
        definitions: '<'
    },

    controller: function () {
        'use strict';

        var $ctrl = this;
        var requiredSecurityTA = 0;
        var requiredSecurityWS = 0;

        $ctrl.requiredSecurityTA = function () {
            if (!$ctrl.review) {
                return requiredSecurityTA;
            }
            if ($ctrl.review.licenseSubType == 'Travel Agent') {
                if ($ctrl.review.totalGrossSaleTA >= 10000000) {
                    requiredSecurityTA = 40000;
                } else if ($ctrl.review.totalGrossSaleTA >= 5000000) {
                    requiredSecurityTA = 25000;
                } else {
                    requiredSecurityTA = 15000;
                }
                $ctrl.review.requiredSecurityTA = requiredSecurityTA;
                $ctrl.requiredSecurityWS = 0;
                $ctrl.review.securityDeficit = requiredSecurityTA - $ctrl.review.securityOnHand;
            }
            return requiredSecurityTA;
        };

        $ctrl.totalEquity = function () {
            $ctrl.review.totalEquity = $ctrl.review.totalAssets - $ctrl.review.totalLiabilities;
            return $ctrl.review.totalEquity;
        };
    }
});