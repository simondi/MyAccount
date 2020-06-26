angular.module('portal.pages.checkout')
.controller('RenewalCheckoutController', function ($state, $scope, $stateParams, lodash, Order, ngToast, $uibModal) {
    'use strict';

    var ctrl = this;

    // Information required for recording payment is only present
    // in state params, i.e. in client-side data model. If it's not 
    // present, e.g. user refreshed page, return to licenses view.
    if (!$stateParams.renewalInfo || !$stateParams.order) {
        $state.go('licenses');
    }
    
    ctrl.title = 'Checkout';
    ctrl.order = $stateParams.order;
    ctrl.renewalInfo = $stateParams.renewalInfo;
    ctrl.message = '';
    ctrl.paymentInfo = {};
    ctrl.isProcessing = false;
    ctrl.payButtonText = 'Confirm and Pay';

    ctrl.confirmAndPay = function () {
        ctrl.isProcessing = true;
        ctrl.payButtonText = 'Payment Processing';

        ctrl.renewalInfo.paymentInfo = ctrl.paymentInfo;
        
        var a = ctrl.order.orderId;
        var b = 'Payment successfully submitted!';
        excutePaymentService(a, b);
    };

    ctrl.cancel = function () {
        $state.go('licenses');
    };

    // If the renewal fee is 0, go directly to recording the result without clicking the submit button
    if (ctrl.order.totalAmount === 0) {
        
        var b = 'Service numbers are successfully recorded!';
        excutePayment(ctrl.order.orderId, b);
    }

    function excutePayment(a, b) {
        ctrl.isProcessing = true;
        ctrl.payButtonText = 'Payment Processing';
        excutePaymentService(a, b);
    };

    function excutePaymentService(a, b) {
        Order.processRenewal({ id: a }, ctrl.renewalInfo).$promise
            .then(function () {
                ngToast.create(b);
                if (ctrl.order.totalAmount === 0) {
                    ctrl.onClickForPopup('app/pages/checkout/paymentZeroAmount.html');
                } else {
                    ctrl.onClickForPopup('app/pages/checkout/paymentSuccesful.html');
                }
                //$state.go('licenses');
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
            $state.go('licenses');
        });
    };
});