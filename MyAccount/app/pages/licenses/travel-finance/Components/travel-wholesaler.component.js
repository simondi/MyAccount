angular.module('portal.pages.licenses.travelFinance').component('travelWholesaler', {
    templateUrl: 'app/pages/licenses/travel-finance/components/travel-wholesaler.template.html',
    bindings: {
        review: '<',
        modelState: '<',
        definitions: '<'
    },

    controller: function () {
        'use strict';

        var $ctrl = this;

        $ctrl.requiredSecurityWS = function () {
            var requiredSecurityWS = 0;
            if (!$ctrl.review) {
                return requiredSecurityWS;
            }
            if ($ctrl.review.licenseSubType == 'Travel Wholesaler') {
                if ($ctrl.review.totalGrossSaleWS >= 25000000) {
                    requiredSecurityWS = 150000;
                } else if ($ctrl.review.totalGrossSaleWS >= 15000000) {
                    requiredSecurityWS = 125000;
                } else if ($ctrl.review.totalGrossSaleWS >= 7000000) {
                    requiredSecurityWS = 100000;
                } else if ($ctrl.review.totalGrossSaleWS >= 5000000) {
                    requiredSecurityWS = 70000;
                } else if ($ctrl.review.totalGrossSaleWS >= 3000000) {
                    requiredSecurityWS = 50000;
                } else if ($ctrl.review.totalGrossSaleWS >= 2000000) {
                    requiredSecurityWS = 35000;
                } else {
                    requiredSecurityWS = 15000;
                }
                $ctrl.review.requiredSecurityWS = requiredSecurityWS;
                $ctrl.requiredSecurityTA = 0;
                $ctrl.review.securityDeficit = requiredSecurityWS - $ctrl.review.securityOnHand;
            }
            return requiredSecurityWS;
        };

        $ctrl.totalEquity = function () {
            $ctrl.review.totalEquity = $ctrl.review.totalAssets - $ctrl.review.totalLiabilities;
            return $ctrl.review.totalEquity;
        };
    }
});