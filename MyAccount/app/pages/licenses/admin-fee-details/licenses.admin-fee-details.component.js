angular.module('portal.pages.licenses.adminFeeDetails')
    .component('licenseAdminFeeDetails', {
        templateUrl: 'app/pages/licenses/admin-fee-details/licenses.admin-fee-details.template.html',
        bindings: {
            adminFee: '=',
            license: '<'
        },
        controller: [
            '$timeout', '$state', 'Order', 'moment', function ($timeout, $state, Order, moment) {
                'use strict';

                var ctrl = this;
                

                ctrl.isEditable = function() {
                    return !(ctrl.adminFee.isAfterPaymentPeriod || ctrl.adminFee.isBeforePaymentPeriod || ctrl.adminFee.paymentReceivedDate);
                };

                ctrl.subtotal = function () {
                    return (ctrl.adminFee.publicGuardianServices +
                        ctrl.adminFee.ministryOfEmploymentServices +
                        ctrl.adminFee.veteransAffairsServices +
                        ctrl.adminFee.lostPostFundServices +
                        ctrl.adminFee.stillbornServices) || 0;
                };

                ctrl.totalPayable = function() {
                    if (ctrl.isEditable) {
                        return Math.max(0, (ctrl.adminFee.totalDeathRegistrations - ctrl.subtotal()) || 0);
                    }

                    return ctrl.totalPayable;
                };

                ctrl.formatDate = function(dateString) {
                    var result = moment(dateString);
                    return result.isValid() ? result.format('MMM D YYYY') : '';
                };

                ctrl.onCancelClicked = function (form) {
                    delete ctrl.adminFee.lostPostFundServices;
                    delete ctrl.adminFee.veteransAffairsServices;
                    delete ctrl.adminFee.ministryOfEmploymentServices;
                    delete ctrl.adminFee.publicGuardianServices;
                    delete ctrl.adminFee.totalDeathRegistrations;
                    delete ctrl.adminFee.stillbornServices;

                    form.$setPristine();
                    form.$setUntouched();
                };

                ctrl.onContinueClicked = function () {
                    var orderItems = [
                        {
                            licenseSeq: ctrl.license.licenseSeq,
                            licenseNumber: ctrl.license.licenseNumber,
                            itemSeq: ctrl.adminFee.id,
                            type: 'Admin',
                            quantity: ctrl.totalPayable()
                        }
                    ];

                    Order.save(orderItems).$promise.then(function (order) {
                        $state.go('adminFeeCheckout', { order: order, adminFeePaymentInfo: ctrl.adminFee });
                    }).catch(function (response) {
                        console.log(response);
                        ctrl.message = response.statusText;
                    });
                };
            }
        ]
    });