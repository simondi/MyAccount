angular.module('portal.components.login')
    .component('login', {
        templateUrl: 'app/components/login/login.component.template.html',
        bindings: {
            onLogin: '&',
            onForgotPassword: '&'
        },
        controller: [
            'Account', function(Account) {
                'use strict';

                var $ctrl = this;

                $ctrl.loginData = {
                    userName: '',
                    password: ''
                };
                
                $ctrl.message = '';

                $ctrl.forgotPassword = function() {
                    if ($ctrl.onForgotPassword) {
                        $ctrl.onForgotPassword({ userName: $ctrl.loginData.userName });
                    }
                };

                $ctrl.login = function() {
                    $ctrl.message = '';

                    var domain = '';
                    var userName = $ctrl.loginData.userName;
                    var parts = userName.split('\\');
                    if (parts.length === 2) {
                        domain = parts[0];
                        userName = parts[1];
                    }

                    Account.login(userName, $ctrl.loginData.password, domain)
                        .then(function() {
                            return Account.identity();
                        })
                        .then(function() {
                           if ($ctrl.onLogin) {
                               $ctrl.onLogin();
                               
                           }
                        })
                        .catch(function(response) {
                            $ctrl.message = response.data.error_description;
                        });
                };
            }
        ]
    });