var app = angular.module('portal', [
    'portal.pages.manage-users',
    'angular-loading-bar',
    'smart-table',
    'ngLodash',
    'ngMessages',
    'ui.router',
    'portal.pages',
    'portal.components',
    'portal.services',
    'portal.filters',
    'portal.core.resources',
    'portal.interceptors.xRespondedJson',
    'portal.interceptors.oauthToken',
    'portal.interceptors.auth-failure',
    'warp.directives.st-select-notifier',
    'warp.directives.st-refresh',
    'warp.directives.st-class-if-filtered',
    'warp.directives.matches-field',
    'warp.directives.confirm-exit',
    'warp.directives.st-activity-monitor',
    'ngMask',
    'ngAria',
    'ngAnimate',
    'ngMaterial',
//    'angular-google-analytics',       // for google analytics
    'ngToast'
]);

app.filter('stringToDate', function ($filter) {
    return function (ele, dateFormat) {
        return $filter('date')(new Date(ele), dateFormat);
    }
});

app.directive('restrictInput', function () {
    return {
        restrict: 'A',
        require: 'ngModel',
        link: function (scope, element, attr, ctrl) {
            ctrl.$parsers.unshift(function (viewValue) {
                var options = scope.$eval(attr.restrictInput);
                if (!options.regex && options.type) {
                    switch (options.type) {
                        case 'digitsOnly': options.regex = '^[0-9]*$'; break;
                        case 'intergersOnly': options.regex = '^-?[0-9]*$'; break;
                        case 'lettersOnly': options.regex = '^[a-zA-Z]*$'; break;
                        case 'lowercaseLettersOnly': options.regex = '^[a-z]*$'; break;
                        case 'uppercaseLettersOnly': options.regex = '^[A-Z]*$'; break;
                        case 'lettersAndDigitsOnly': options.regex = '^[a-zA-Z0-9]*$'; break;
                        case 'validPhoneCharsOnly': options.regex = '^[0-9 ()/-]*$'; break;
                        default: options.regex = '';
                    }
                }
                var reg = new RegExp(options.regex);
                if (reg.test(viewValue)) { //if valid view value, return it
                    return viewValue;
                } else { //if not valid view value, use the model value (or empty string if that's also invalid)
                    var overrideValue = (reg.test(ctrl.$modelValue) ? ctrl.$modelValue : '');
                    element.val(overrideValue);
                    return overrideValue;
                }
            });
        }
    };
});

// Tabing to input field in order. To use add tabindex="1" auto-next in <input>
app.directive('autoNext', function () {
    return {
        restrict: 'A',
        link: function (scope, element, attr, form) {
            var tabindex = parseInt(attr.tabindex);
            var maxLength = parseInt(attr.ngMaxlength);
            element.on('keypress', function (e) {
                if (element.val().length > maxLength - 1) {
                    var next = angular.element(document.body).find('[tabindex=' + (tabindex + 1) + ']');
                    if (next.length > 0) {
                        next.focus();
                        return next.triggerHandler('keypress', { which: e.which });
                    }
                    else {
                        return false;
                    }
                }
                return true;
            });

        }
    }
});

// Use endWith function for older browser (OR IE11) from www.javascripthive.info/javascript/javascript-string-endswith/
if (typeof String.prototype.endsWith !== 'function') {
    String.prototype.endsWith = function (searchString, position) {
        if (position === null || position < 0 || Math.floor(position) !== position) {
            position = this.length;
        }
        position -= searchString.length;
        return this.indexOf(searchString, position) !== -1;
    }
}

//apiServiceBaseUri:  'http://localhost/IRIS.Api3/',  'https://apitest.consumerprotectionbc.ca/', // Modified by gulp
app.constant('authSettings', {
    apiServiceBaseUri: 'https://apidev.consumerprotectionbc.ca/', 
    clientId: 'licenseePortalApp'
});


app.constant('userClaims', {
    'ViewBusiness': 'http://claims.consumerprotectionbc.ca/2016/business/view',
    'ManageExternalUsers': 'http://claims.consumerprotectionbc.ca/2016/users/manage/external'
});

app.constant('manageUserViewPrefs', {
    usersPerPage: 5,
    businessesPerPage: 50
});

app.config(function($stateProvider, $urlRouterProvider, $locationProvider, $httpProvider, userClaims) {
    'use strict';

    // Allow cookies to be sent with cross-site requests.
    $httpProvider.defaults.withCredentials = true;

    // ASP.NET expect the X-Requested-With header
    //$httpProvider.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';

    // ASP.NET put XMLHttpRequest error code in a custom header.
    $httpProvider.interceptors.push('XRespondedJson');

    // Include oAuth bearer token in request header
    $httpProvider.interceptors.push('OAuthTokenInterceptor');

    // Redirect to login if AJAX request return 401 or 403
    $httpProvider.interceptors.push('AuthenticationInterceptor');

    var Identity = [
        '$q', 'Account', 'IdentityCache', function($q, Account) {
             /// <summary>
             /// s the specified $q.
             /// </summary>
             /// <param name="$q">The $q.</param>
             /// <param name="Account">The account.</param>
             /// <returns></returns>
             return Account.identity().then(function(identity) {
                return $q.when(identity.data);
            }).catch(function(resp) {
                return $q.reject(resp);
            });
        }
    ];

    var Licenses = [
        '$q', 'License', function($q, License) {
            return License.query().$promise.then(function(data) {
                return $q.when(data);
            }).catch(function(res) {
                return $q.reject(res);
            });
        }
    ];

    var License = [
        '$q', '$stateParams', 'lodash', 'licenses', function ($q, $stateParams, lodash, licenses) {
            var license = lodash.find(licenses, ['licenseSeq', parseInt($stateParams.id)]);
            if (license !== null) {
                return $q.when(license);
            } else {
                return $q.reject({ status: 404 });
            }
        }
    ];

    var FuneralServicesAdminFees = [
        '$q', 'license', 'License', function ($q, license, License) {
            return License.funeralServicesAdminFees({ id: license.licenseSeq }).$promise.then(function (data) {
                return $q.when(data);
            }).catch(function (res) {
                return $q.reject(res);
            });
        }
    ];

    var FinancialReviews = [
        '$q', 'FinancialReview', 'license', function ($q, FinancialReview, license) {
            
            return FinancialReview.query({ licenseId: license.licenseSeq }).$promise.then(function (data) {
                return $q.when(data);
            }).catch(function (res) {
                return $q.reject(res);
            });
        }
    ];

    var TravelFinances = [
            '$q', 'TravelFinance', 'license', function ($q, TravelFinance, license) {
                return TravelFinance.query({ licenseId: license.licenseSeq }).$promise.then(function (data) {
                    return $q.when(data);
                }).catch(function (res) {
                    return $q.reject(res);
                });
            }
    ];

    var CheckSingleClaim = [
        '$q', 'lodash', 'identity', 'claim', function ($q, lodash, identity, claim) {
            var found= lodash(identity.claims)
                .find({ name: claim.name, value: claim.value });
            if (found) {
                return $q.when();
            }
            return $q.reject({ status: 401 });
        }
    ];

    //$urlRouterProvider.otherwise('/login');
    $urlRouterProvider.otherwise(function () {
        window.location.href = '/login'; // redirect to the new Angular app!
    });

    $stateProvider
        .state('login', {
            url: '/login',
            templateUrl: 'app/pages/login/login.template.html',
            controller: 'LoginController'
        })
        .state('signup', {
            url: '/signup',
            templateUrl: 'app/pages/signup/signup.template.html',
            controller: 'SignupController'
        })
        .state('licenses', {
            url: '/licenses',
            templateUrl: 'app/pages/licenses/licenses.template.html',
            controller: 'LicensesController',
            controllerAs: 'ctrl',
            resolve: {
                identity: Identity,
                licenses: Licenses
            }
        })
        .state('licenses.details', {
            url: '/:id/details',
            templateUrl: 'app/pages/licenses/details/licenses.details.template.html',
            controller: 'LicensesDetailsController',
            controllerAs: 'ctrl',
            resolve: {
                license: License
            }
        })
        .state('licenses.individuals', {
            url: '/:id/individuals',
            templateUrl: 'app/pages/licenses/individuals/licenses.individuals.template.html',
            controller: 'LicensesIndividualsController',
            controllerAs: 'ctrl',
            resolve: {
                license: License
            }
        })
        .state('licenses.adminFees', {
            url: '/:id/adminFees',
            templateUrl: 'app/pages/licenses/admin-fees/licenses.admin-fees.template.html',
            controller: 'LicensesAdminFeesController',
            controllerAs: 'ctrl',
            resolve: {
                license: License,
                adminFees: FuneralServicesAdminFees
            }
        })
        .state('licenses.preneed', {
            url: '/:id/preneed',
            templateUrl: 'app/pages/licenses/preneed/licenses.preneed.template.html',
            controller: 'LicensesPreneedController',
            controllerAs: 'ctrl',
            resolve: {
                license: License
            }
        })
        .state('licenses.financialReview', {
            url: '/:id/financialReview',
            templateUrl: 'app/pages/licenses/financial-review/licenses.financial-review.template.html',
            controller: 'LicensesFinancialReviewController',
            controllerAs: 'ctrl',
            resolve: {
                license: License
              , financialReviews: FinancialReviews
            }
        })
        .state('licenses.travelFinance', {
            url: '/:id/travelFinance',
            templateUrl: 'app/pages/licenses/travel-finance/licenses.travel-finance.template.html',
            controller: 'LicensesTravelFinanceController',
            controllerAs: 'ctrl',
            resolve: {
                license: License
              , travelFinances: TravelFinances
            }
        })
        .state('redeem-invitation', {
            url: '/user/:id/redeem-invitation/:token',
            templateUrl: 'app/pages/password-change/password-change.template.html',
            controller: 'PasswordChangeController',
            controllerAs: 'ctrl',
            params: {tokenType: 'invitation'}
        })
        .state('redeem-reset', {
            url: '/user/:id/redeem-reset/:token',
            templateUrl: 'app/pages/password-change/password-change.template.html',
            controller: 'PasswordChangeController',
            controllerAs: 'ctrl',
            params: { tokenType: 'reset' }
        })
        .state('user-settings', {
            url: '/user-settings',
            templateUrl: 'app/pages/user-settings/user-settings.template.html',
            controller: 'UserSettingsController',
            controllerAs: 'ctrl',
            resolve: {
                identity: Identity,
                usersResource: 'User',
                currentUser: function(usersResource, identity) {
                    return usersResource.get({ id: identity.id });
                }
            }
        })
        .state('forgot-password', {
            url: '/user/forgot-password',
            templateUrl: 'app/pages/forgot-password/forgot-password.template.html',
            controller: 'ForgotPasswordController',
            controllerAs: 'ctrl',
            params: {
                email: ''
            }
        })
        .state('change-password', {
            url: '/user/change-password',
            templateUrl: 'app/pages/password-change/password-change.template.html',
            controller: 'PasswordChangeController',
            controllerAs: 'ctrl',
            resolve: {
                identity: Identity
            }
        })
        .state('change-passwordEmail', {
            url: '/user/change-passwordEmail',
            templateUrl: 'app/pages/passwordEmail-change/passwordEmail-change.template.html',
            controller: 'PasswordEmailChangeController',
            controllerAs: 'ctrl',
            resolve: {
                identity: Identity
            }
        })
        .state('change-email', {
            url: '/user/user-changeEmail',
            templateUrl: 'app/pages/user-changeEmail/user-changeEmail.template.html',
            controller: 'EmailChangeController',
            controllerAs: 'ctrl',
            resolve: {
                identity: Identity
            }
        })
        .state('renew', {
            url: '/renew',
            templateUrl: 'app/pages/renew/renew.template.html',
            controller: 'RenewController',
            controllerAs: 'ctrl',
            params: {
                licensesToRenew: { array: true }
            },
            resolve: {
                identity: Identity
            }
        })
        .state('renewalCheckout', {
            url: '/renewalCheckout',
            templateUrl: 'app/pages/checkout/checkout.template.html',
            controller: 'RenewalCheckoutController',
            controllerAs: 'ctrl',
            params: {
                order: null,
                renewalInfo: null
            },
            resolve: {
                identity: Identity
            }
        })
        .state('adminFeeCheckout', {
            url: '/adminFeeCheckout',
            templateUrl: 'app/pages/checkout/checkout.template.html',
            controller: 'AdminFeeCheckoutController',
            controllerAs: 'ctrl',
            params: {
                order: null,
                adminFeePaymentInfo: null
            },
            resolve: {
                identity: Identity,
                PreviousState: [
                    '$state',
                    function ($state) {
                        var currentStateData = {
                            Name: $state.current.name,
                            Params: $state.params,
                            URL: $state.href($state.current.name, $state.params)
                        };
                        return currentStateData;
                    }
                ]
            }
        })
        .state('tafPaymentCheckout', {
            url: '/tafPaymentCheckout',  
            templateUrl: 'app/pages/checkout/checkout.template.html',
            controller: 'TAFCheckoutController',
            controllerAs: 'ctrl',
            params: {
                order: null,
                tafPaymentInfo: null     
            },
            resolve: {
                identity: Identity,
                PreviousState: [
                    '$state',
                    function ($state) {
                        var currentStateData = {
                            Name: $state.current.name,
                            Params: $state.params,
                            URL: $state.href($state.current.name, $state.params)
                        };
                        return currentStateData;
                    }
                ]
            }
        })
        .state('manageUsers', {
            url: '/manage-users',
            templateUrl: 'app/pages/manage-users/manage-users.template.html',
            controller: 'ManageUsersController',
            controllerAs: 'ctrl',
            resolve: {
                identity: Identity,
                claim: function() {
                    return { name: userClaims.ManageExternalUsers, value: 'true' };
                },
                checkClaims: CheckSingleClaim
            }
        });
});

// for google analytics
// Add configuration code as desired - https github.com/revolunet/angular-google-analytics
//app.config(['AnalyticsProvider', function (AnalyticsProvider) {
//    AnalyticsProvider.setAccount('UA-2984358-2');
//}]).run(['Analytics', function (Analytics) { }]);

app.run();
