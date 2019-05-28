angular.module('portal.pages.manage-users')
    .controller('ManageUsersController', ['User', '$uibModal', function (User, $uibModal) {
            'use strict';
            var ctrl = this;

            ctrl.selectedUser = undefined;
            ctrl.selectedTab = 0;
            ctrl.userListApi = {};

            ctrl.onSelectionChanged = function(user) {
                ctrl.selectedUser = user;
            };

            ctrl.onClickCreateUser = function() {
                var modal = $uibModal.open({
                    templateUrl: 'app/pages/manage-users/add-user/add-user.template.html',
                    controller: 'AddUserController',
                    controllerAs: '$ctrl',
                    size: 'lg'
                });

                modal.result.then(function (usedId) {
                    ctrl.userListApi.showUser(usedId);
                });
            };

            ctrl.onClickMassCreateUsers = function() {
                $uibModal.open({
                    templateUrl: 'app/pages/manage-users/mass-create/mass-create.template.html',
                    controller: 'MassCreateUsersController',
                    controllerAs: '$ctrl',
                    size: 'lg'
                });
            };
        }]
    );