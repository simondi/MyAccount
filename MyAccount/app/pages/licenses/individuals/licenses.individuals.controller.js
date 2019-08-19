angular.module('portal.pages.licenses.individuals')
.controller('LicensesIndividualsController', function ($scope, $stateParams, license) {
    'use strict';

    var ctrl = this;
    ctrl.title = 'Employees';
    ctrl.license = license;

    $scope.$parent.ctrl.selectCurrentRow($stateParams.id, ctrl.license);

    ctrl.backToLicenses = function () {
        $state.go('licenses');
    }

});