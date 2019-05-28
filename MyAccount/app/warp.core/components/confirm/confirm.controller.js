angular.module('warp.components.confirm')
.controller('ConfirmController', function($scope, 
    $uibModalInstance, 
    title,
    message,
    okButtonLabel,
    cancelButtonLabel,
    showCancelButton)
{
    'use strict';
    'ngInject';

    var ctrl = this;

    ctrl.title = title;
    ctrl.message = message;
    ctrl.okButtonLabel = okButtonLabel;
    ctrl.cancelButtonLabel = cancelButtonLabel;
    ctrl.showCancelButton = showCancelButton;

    ctrl.onOk = function() {
        $uibModalInstance.close();
    };

    ctrl.onCancel = function() {
        $uibModalInstance.dismiss('cancel');
    };
});