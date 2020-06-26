angular.module('portal.pages.checkout')
    .controller('TAFCheckoutController', function ($state, $scope, $stateParams, lodash, Order, ngToast, $uibModal, PreviousState) {
        'use strict';

        var ctrl = this;

        // Information required for recording payment is only present
        // in state params, i.e. in client-side data model. If it's not 
        // present, e.g. user refreshed page, return to licenses view.
        if (!$stateParams.tafPaymentInfo || !$stateParams.order) {
            $state.go('licenses');
        }

        ctrl.title = 'Checkout';
        ctrl.order = $stateParams.order;
        ctrl.message = '';
        ctrl.paymentInfo = {};
        ctrl.isProcessing = false;
        ctrl.payButtonText = 'Confirm and Pay';
        ctrl.tafPaymentInfo =
        {
            tafPaymentDetails: $stateParams.tafPaymentInfo,
            orderId: ctrl.order.orderId
        };

        ctrl.confirmAndPay = function() {
            ctrl.isProcessing = true;
            ctrl.payButtonText = 'Payment Processing';

            ctrl.paymentInfo.totalAmount = ctrl.order.totalAmount;    // Fixing a bug for adding late payment fee
            ctrl.tafPaymentInfo.paymentInfo = ctrl.paymentInfo;

            var a = ctrl.order.orderId;
            var b = 'Payment successfully submitted!';
            excutePaymentService(a, b);
        };

        ctrl.cancel = function () {
            $state.go(PreviousState.Name, PreviousState.Params);
        };

        if (ctrl.order.totalAmount === 0) {
            var b = 'Service numbers are successfully recorded!';
            excutePayment(0, b);
        }

        function excutePayment(a, b) {
            ctrl.isProcessing = true;
            ctrl.payButtonText = 'Payment Processing';
            excutePaymentService(a, b);
        };

        function excutePaymentService(a, b) {
            Order.processTafPayment({ id: a }, ctrl.tafPaymentInfo).$promise
                .then(function () {
                    ngToast.create(b);
                    ctrl.onClickForPopup('app/pages/checkout/paymentSuccesful.html');
                    //$state.go(PreviousState.Name, PreviousState.Params);
                })
                .catch(function (response) {
                    console.log(response);
                    ctrl.message = response.statusText;
                    ctrl.isProcessing = false;
                    ctrl.payButtonText = 'Retry Payment';
                });
        };

        //popup for all with different url content
        ctrl.onClickForPopup = function (url) {
            var modal = $uibModal.open({
                templateUrl: url,
                controller: 'PopupController',
                controllerAs: '$ctrl',
                size: 'lg'
            }).closed.then(function () {
                $state.go(PreviousState.Name, PreviousState.Params);
            });
        };

    });