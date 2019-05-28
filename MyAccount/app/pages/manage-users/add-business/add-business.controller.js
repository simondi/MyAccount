angular.module('portal.pages.manage-users')
    .controller('AddBusinessController', ['user', 'businesses', 'lodash', '$uibModalInstance',
        function (user, businesses, lodash, $uibModalInstance) {
        'use strict';

        var ctrl = this;
        ctrl.user = user;

        ctrl.selectedBusinesses = lodash.chain(businesses)
            .filter({ isAuthorizedViaHeadOffice: false })
            .map('businessSeq').value();

            ctrl.onOkClicked = function() {
                $uibModalInstance.close(ctrl.selectedBusinesses);
            };

        ctrl.onCancelClicked = function () {
            $uibModalInstance.dismiss('cancel');
        };
    }]);