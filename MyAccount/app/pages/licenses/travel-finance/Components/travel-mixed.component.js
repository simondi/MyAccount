angular.module('portal.pages.licenses.travelFinance').component('travelMixed', {
    templateUrl: 'app/pages/licenses/travel-finance/components/travel-mixed.template.html',
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
        var totalRequiredSecurity = requiredSecurityTA + requiredSecurityWS;

        $ctrl.requiredSecurityTA = function () {
            if (!$ctrl.review) {
                return requiredSecurityTA;
            }
            if ($ctrl.review.licenseSubType == 'Mixed Travel Agent/Wholesaler') {
                if ($ctrl.review.totalGrossSaleTA >= 10000000) {
                    requiredSecurityTA = 40000;
                } else if ($ctrl.review.totalGrossSaleTA >= 5000000) {
                    requiredSecurityTA = 25000;
                } else {
                    requiredSecurityTA = 15000;
                }
                $ctrl.review.requiredSecurityTA = requiredSecurityTA;
                totalRequiredSecurity = requiredSecurityTA + requiredSecurityWS;
                $ctrl.review.securityDeficit = totalRequiredSecurity - $ctrl.review.securityOnHand;
            }
            return requiredSecurityTA;
        };

        $ctrl.requiredSecurityWS = function () {
            if (!$ctrl.review) {
                return requiredSecurityWS;
            }
            if ($ctrl.review.licenseSubType == 'Mixed Travel Agent/Wholesaler') {
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
                totalRequiredSecurity = requiredSecurityTA + requiredSecurityWS;
                $ctrl.review.securityDeficit = totalRequiredSecurity - $ctrl.review.securityOnHand;
            }
            return requiredSecurityWS;
        };

        $ctrl.totalEquity = function () {
            $ctrl.review.totalEquity = $ctrl.review.totalAssets - $ctrl.review.totalLiabilities;
            return $ctrl.review.totalEquity;
        };
    }
});