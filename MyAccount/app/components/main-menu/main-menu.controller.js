angular.module('portal.components.main-menu')
    .controller('MainMenuController', [
        '$scope', '$state', 'Account', 'IdentityCache', 'Version', function($scope, $state, Account, IdentityCache, Version) {
            'use strict';

            $scope.logOut = function() {
                Account.logout().then(function() {
                    $state.go('login');
                });
            };

            $scope.version = Version.get();

            $scope.identityCache = IdentityCache;
            $scope.hasBusiness = function() {
                var businesses = $scope.identityCache.businesses();
                return businesses.length > 0;
            };

            $scope.hoverIn = function () {
                $(this).find('.dropdown-menu').stop(true, true).delay(200).fadeIn(500);
            };

            $scope.hoverOut = function () {
                $(this).find('.dropdown-menu').stop(true, true).delay(200).fadeOut(500);
            };
        }
    ]);

 