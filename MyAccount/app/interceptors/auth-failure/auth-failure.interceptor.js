angular.module('portal.interceptors.auth-failure', [])
    .factory('AuthenticationInterceptor', function ($injector, $q, lodash) {
        'use strict';
        'ngInject';

        var modalOpen = false;
        var deferredRejections = [];

        return {
            'responseError': function (rejection) {

                // If the user gets an auth error while logging in, or it's not an auth-related error, treat normally and reject.
                if (rejection.config.url.endsWith('/Token')|| (rejection.status !== 401 && rejection.status !== 403)) {
                    return $q.reject(rejection);
                }
                var deferred = $q.defer();

                // Collect all of the deferred promises, so we can resolve them once the user logs in.
                deferredRejections.push({ deferred: deferred, rejection: rejection });

                // Make sure not to open more than one modal, in the case of subsequent rejected API calls.
                if (modalOpen === true) {
                    return deferred.promise;
                }

                var modal = $injector.get('$uibModal').open({
                    animation: true,
                    component: 'loginModal',
                    url:  'app/components/login-modal/login-modal.component.template.html',
                    backdrop: 'static',
                    windowClass: 'center-modal',
                    size: 'md'
                });

                modalOpen = true;

                modal.result
                    .then(function () {
                        // Resolve all of the deferred promises by retrying the rejected API call
                        lodash(deferredRejections).each(function (item) {
                            item.deferred.resolve($injector.get('$http')(item.rejection.config));
                        });
                    })
                    .catch(function () {
                        // Reject all of the deferred promises
                        lodash(deferredRejections).each(function (item) {
                            item.deferred.reject(item.rejection);
                        });
                    })
                    .finally(function () {
                        modalOpen = false;
                        deferredRejections = [];
                    });

                return deferred.promise;
            }
        };
    });