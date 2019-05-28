angular.module('portal.pages.licenses')
    .controller('PopupController', [ '$uibModalInstance', 'Confirm',
        function ( $uibModalInstance, Confirm) {
            'use strict';

            var ctrl = this;

            ctrl.onCancelClicked = function () {
                $uibModalInstance.dismiss('cancel');
            };
        }
    ]);