angular.module('portal.pages.renew')
    .controller('RenewController', function($state, $scope, $stateParams, lodash, Order) {
        'use strict';

        var ctrl = this;

        ctrl.title = 'Renew Licenses';
        ctrl.licenses = $stateParams.licensesToRenew;
        if (!ctrl.licenses){
            var valStr = window.localStorage.getItem('licensesToRenew');
            var licensesToRenew = JSON.parse(valStr);
            if (licensesToRenew && licensesToRenew.length){
                ctrl.licenses = licensesToRenew;
            }
        }
        ctrl.itemsByPage = 5;
        ctrl.renewalInfo = {};
        ctrl.message = '';

        function initController() {
            ctrl.renewalInfo.licenseRenewalInfo = {};
            lodash.forEach(ctrl.licenses, function(license) {
                ctrl.renewalInfo.licenseRenewalInfo[license.licenseSeq] = {};
            });
        }

        ctrl.canCheckout = function() {
            if (!$scope.renewForm.$valid ||
                ctrl.renewalInfo.criminalConviction === undefined ||
                ctrl.renewalInfo.officerChanges === undefined ||
                (!ctrl.licenses[0].isMotionPictureLicense && ctrl.renewalInfo.ownershipChanges === undefined)) {
                return false;
            }

            return true;
        };

        ctrl.checkout = function () {
            var orderItems = [];

            // Build order items
            lodash.forEach(ctrl.licenses,
                function (license) {
                    if (license.licenseTypeSeq == 4) // Cemetery
                    {
                        orderItems.push({
                            licenseSeq: license.licenseSeq,
                            licenseNumber: license.licenseNumber,
                            type: 'Renewal',
                            quantity: ctrl.renewalInfo.licenseRenewalInfo[license.licenseSeq].internmentsCremated + ctrl.renewalInfo.licenseRenewalInfo[license.licenseSeq].internmentsHuman || 1
                        });
                    } else {
                        orderItems.push({
                            licenseSeq: license.licenseSeq,
                            licenseNumber: license.licenseNumber,
                            type: 'Renewal',
                            quantity: ctrl.renewalInfo.licenseRenewalInfo[license.licenseSeq].fteCount || 1
                        });
                    }
                }
            );

            Order.save(orderItems).$promise.then(function(order) {
                ctrl.renewalInfo.orderId = order.orderId;

                $state.go('renewalCheckout', { order: order, renewalInfo: ctrl.renewalInfo });
            }).catch(function(response) {
                console.log(response);
                ctrl.message = response.statusText;
            });
        };

        ctrl.cancel = function() {
            $state.go('licenses');
        };

        initController();
    });