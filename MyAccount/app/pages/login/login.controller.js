angular.module('portal.pages.login')
    .controller('LoginController', [
        '$scope', '$state', 'Account', 'IdentityCache', '$location', function ($scope, $state, Account, IdentityCache, $location) {
            'use strict';

            $scope.loginData = {
                userName: '',
                password: ''
            };

            window.location.href = "/login";

            $scope.message = '';

            $scope.login = function () {
                $scope.message = '';

                var domain = '';
                var userName = $scope.loginData.userName;
                var parts = userName.split('\\');
                if (parts.length === 2) {
                    domain = parts[0];
                    userName = parts[1];
                }

                Account.login(userName, $scope.loginData.password, domain)
                    .then(function () {
                        return Account.identity();
                    })
                    .then(function () {
                        if ($state.destination) {
                            $location.url($state.destination);
                            $state.destination = undefined;
                        } else if (IdentityCache.hasRole('BPCPA')) {
                            $state.go('manageUsers');
                        } else {
                            $state.go('licenses');
                        }
                    })
                    .catch(function (response) {
                        $scope.message = response.data.error_description;
                    });
            };

        }
    ]);