angular.module('portal.pages.licenses.adminFees')
    .controller('LicensesAdminFeesController', function ($rootScope, $stateParams, $location, license, adminFees, moment, lodash) {
        'use strict';

        var ctrl = this;
        ctrl.title = 'Admin Fees';
        ctrl.license = license;
        ctrl.adminFees = adminFees;

        if (ctrl.adminFees) {
            if ($location.search().feeId) {
                ctrl.selectedFee = lodash(ctrl.adminFees).find({ id: Number($location.search().feeId) });
            } else if (ctrl.adminFees.length) {
                var now = moment();
                ctrl.selectedFee = lodash(ctrl.adminFees).find(function(fee) {
                    return moment(fee.periodEndDate) < now;
                });
            }
            if (!ctrl.selectedFee) {
                ctrl.selectedFee = ctrl.adminFees[0];
            }
        }

        ctrl.onFeeSelected = function(fee) {
            ctrl.selectedFee = fee;
            $location.search({ feeId: fee.id });
        };

        ctrl.formatDate = function(dateString) {
            return moment(dateString).format('MMM D YYYY');
        };

    });