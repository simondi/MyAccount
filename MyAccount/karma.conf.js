
module.exports = function(karma) {
    process.env.PHANTOMJS_BIN = "node_modules/phantomjs-prebuilt/bin/phantomjs";

    karma.set({
        /**
     * From where to look for files, starting with the location of this file.
     */
        basePath: "./",

        /**
     * Filled by the task `gulp karma-conf`
     */
        files: [
                           
                                                                  'bower_components/angular/angular.js',
                           
                                                                  'bower_components/angular-ui-router/angular-ui-router.js',
                           
                                                                  'bower_components/angular-resource/angular-resource.js',
                           
                                                                  'bower_components/angular-smart-table/dist/smart-table.js',
                           
                                                                  'bower_components/angular-messages/angular-messages.js',
                           
                                                                  'bower_components/angular-animate/angular-animate.js',
                           
                                                                  'bower_components/ng-lodash/build/ng-lodash.js',
                           
                                                                  'bower_components/angular-bootstrap/ui-bootstrap-tpls.js',
                           
                                                                  'bower_components/angular-local-storage/dist/angular-local-storage.js',
                           
                                                                  'bower_components/angular-loading-bar/build/loading-bar.js',
                           
                                                                  'bower_components/ngMask/dist/ngMask.js',
                           
                                                                  'bower_components/angular-sanitize/angular-sanitize.js',
                           
                                                                  'bower_components/angular-upload/angular-upload.js',
                           
                                                                  'bower_components/moment/moment.js',
                           
                                                                  'bower_components/ngToast/dist/ngToast.js',
                           
                                                                  'bower_components/angular-moment/angular-moment.js',
                           
                                                                  'bower_components/angular-mocks/angular-mocks.js',
                           
                                                                  'bower_components/chai-spies/chai-spies.js',
                           
                                                                  'app/pages/licenses/financial-review/licenses.financial-review.module.js',
                           
                                                                  'app/pages/licenses/financial-review/services/definitions.service.js',
                           
                                                                  'app/pages/licenses/financial-review/components/loans-by-term.component.js',
                           
                                                                  'app/pages/licenses/financial-review/components/loans-by-dollar.component.js',
                           
                                                                  'app/pages/licenses/financial-review/components/loan-transactions.controller.js',
                           
                                                                  'app/pages/licenses/financial-review/components/loan-fees.component.js',
                           
                                                                  'app/pages/licenses/financial-review/components/loan-borrowers.component.js',
                           
                                                                  'app/pages/licenses/financial-review/components/defaulted-loans.component.js',
                           
                                                                  'app/pages/licenses/financial-review/components/ancillary-products.component.js',
                           
                                                                  'app/pages/licenses/financial-review/components/all-loans.component.js',

                                                                  'app/pages/licenses/financial-review/components/travel-finance.component.js',
                           
                                                                  'app/warp.core/directives/st-select-notifier/st-select-notifier.module.js',
                           
                                                                  'app/warp.core/directives/st-select-notifier/st-select-notifier.directive.js',
                           
                                                                  'app/warp.core/directives/st-refresh/st-refresh.module.js',
                           
                                                                  'app/warp.core/directives/st-refresh/st-refresh.directive.js',
                           
                                                                  'app/warp.core/directives/st-page-summary/st-select-page-summary.module.js',
                           
                                                                  'app/warp.core/directives/st-page-summary/st-page-summary.component.js',
                           
                                                                  'app/warp.core/directives/st-class-if-filtered/st-class-if-filtered.module.js',
                           
                                                                  'app/warp.core/directives/st-class-if-filtered/st-class-if-filtered.directive.js',
                           
                                                                  'app/warp.core/directives/matches-field/matches-field.module.js',
                           
                                                                  'app/warp.core/directives/matches-field/matches-field.directive.js',
                           
                                                                  'app/warp.core/directives/confirm-exit/confirm-exit.module.js',
                           
                                                                  'app/warp.core/directives/confirm-exit/confirm-exit.directive.js',
                           
                                                                  'app/warp.core/components/confirm/confirm.module.js',
                           
                                                                  'app/warp.core/components/confirm/confirm.service.js',
                           
                                                                  'app/warp.core/components/confirm/confirm.controller.js',
                           
                                                                  'app/pages/renew/telemarketer/renew-telemarketer.module.js',
                           
                                                                  'app/pages/renew/telemarketer/renew-telemarketer.component.js',
                           
                                                                  'app/pages/renew/summary/renew-summary.module.js',
                           
                                                                  'app/pages/renew/summary/renew-summary.component.js',
                           
                                                                  'app/pages/renew/pre-arranged/renew-pre-arranged.module.js',
                           
                                                                  'app/pages/renew/pre-arranged/renew-pre-arranged.component.js',
                           
                                                                  'app/pages/renew/funeral/renew-funeral.module.js',
                           
                                                                  'app/pages/renew/funeral/renew-funeral.component.js',
                           
                                                                  'app/pages/renew/declaration/renew-declaration.module.js',
                           
                                                                  'app/pages/renew/declaration/renew-declaration.component.js',
                           
                                                                  'app/pages/renew/crematorium/renew-crematorium.module.js',
                           
                                                                  'app/pages/renew/crematorium/renew-crematorium.component.js',
                           
                                                                  'app/pages/renew/corporate/renew-corporate.module.js',
                           
                                                                  'app/pages/renew/corporate/renew-corporate.component.js',
                           
                                                                  'app/pages/renew/cemetery/renew-cemetery.module.js',
                           
                                                                  'app/pages/renew/cemetery/renew-cemetery.component.js',
                           
                                                                  'app/pages/manage-users/manager-users.module.js',
                           
                                                                  'app/pages/manage-users/user-list/user-list.component.js',
                           
                                                                  'app/pages/manage-users/user-details/user-details.component.js',
                           
                                                                  'app/pages/manage-users/user-details/change-email.controller.js',
                           
                                                                  'app/pages/manage-users/user-businesses/user-businesses.component.js',
                           
                                                                  'app/pages/manage-users/mass-create/mass-create.controller.js',
                           
                                                                  'app/pages/manage-users/business-search/business-search.component.js',
                           
                                                                  'app/pages/manage-users/add-user/add-user.controller.js',
                           
                                                                  'app/pages/manage-users/add-business/add-business.controller.js',
                           
                                                                  'app/pages/licenses/individuals/licenses.individuals.module.js',
                           
                                                                  'app/pages/licenses/individuals/licenses.individuals.controller.js',
                           
                                                                  'app/pages/licenses/financial-review/licenses.financial-review.controller.js',
                           
                                                                  'app/pages/licenses/details/licenses.details.module.js',
                           
                                                                  'app/pages/licenses/details/licenses.details.controller.js',
                           
                                                                  'app/pages/licenses/admin-fees/licenses.admin-fees.module.js',
                           
                                                                  'app/pages/licenses/admin-fees/licenses.admin-fees.controller.js',
                           
                                                                  'app/pages/licenses/admin-fee-details/licenses.admin-fee-details.module.js',
                           
                                                                  'app/pages/licenses/admin-fee-details/licenses.admin-fee-details.component.js',
                           
                                                                  'app/core/resources/user/user.module.js',
                           
                                                                  'app/core/resources/version/version.service.js',
                           
                                                                  'app/core/resources/version/version.module.js',
                           
                                                                  'app/core/resources/user/user.service.js',
                           
                                                                  'app/core/resources/role/role.module.js',
                           
                                                                  'app/core/resources/role/role.service.js',
                           
                                                                  'app/core/resources/order/order.module.js',
                           
                                                                  'app/core/resources/order/order.service.js',
                           
                                                                  'app/core/resources/license/license.module.js',
                           
                                                                  'app/core/resources/license/license.service.js',
                           
                                                                  'app/core/resources/financial-review/financial-review.module.js',
                           
                                                                  'app/core/resources/financial-review/financial-review.service.js',
                           
                                                                  'app/core/resources/account/account.module.js',
                           
                                                                  'app/core/resources/account/account.service.js',
                           
                                                                  'app/services/identity-cache/identity-cache.module.js',
                           
                                                                  'app/services/identity-cache/identity-cache.service.js',
                           
                                                                  'app/services/asp-net-helpers/asp-net-helpers.module.js',
                           
                                                                  'app/services/asp-net-helpers/asp-net-helpers.service.js',
                           
                                                                  'app/pages/user-settings/user-settings.module.js',
                           
                                                                  'app/pages/user-settings/user-settings.controller.js',
                           
                                                                  'app/pages/renew/renew.module.js',
                           
                                                                  'app/pages/renew/renew.controller.js',
                           
                                                                  'app/pages/password-change/password-change.module.js',
                           
                                                                  'app/pages/password-change/password-change.controller.js',
                           
                                                                  'app/pages/manage-users/manage-users.controller.js',
                           
                                                                  'app/pages/login/login.module.js',
                           
                                                                  'app/pages/login/login.controller.js',
                           
                                                                  'app/pages/licenses/licenses.module.js',
                           
                                                                  'app/pages/licenses/licenses.controller.js',
                           
                                                                  'app/pages/forgot-password/forgot-password.module.js',
                           
                                                                  'app/pages/forgot-password/forgot-password.controller.js',
                           
                                                                  'app/pages/checkout/checkout.module.js',
                           
                                                                  'app/pages/checkout/renewal-checkout.controller.js',
                           
                                                                  'app/pages/checkout/admin-fee-checkout.controller.js',
                           
                                                                  'app/interceptors/x-responded-json/x-responded-json.module.js',
                           
                                                                  'app/interceptors/x-responded-json/x-reponded-json.interceptor.js',
                           
                                                                  'app/interceptors/oauth-token/oauth-token.module.js',
                           
                                                                  'app/interceptors/oauth-token/oauth-token.interceptor.js',
                           
                                                                  'app/interceptors/auth-failure/auth-failure.module.js',
                           
                                                                  'app/interceptors/auth-failure/auth-failure.interceptor.js',
                           
                                                                  'app/filters/street-address/street-address.module.js',
                           
                                                                  'app/filters/street-address/street-address.filter.js',
                           
                                                                  'app/filters/phone-number/phone-number.module.js',
                           
                                                                  'app/filters/phone-number/phone-number.filter.js',
                           
                                                                  'app/filters/full-address/full-address.module.js',
                           
                                                                  'app/filters/full-address/full-address.filter.js',
                           
                                                                  'app/core/resources/resources.module.js',
                           
                                                                  'app/components/main-menu/main-menu.module.js',
                           
                                                                  'app/components/main-menu/main-menu.controller.js',
                           
                                                                  'app/components/main-menu/main-menu.component.js',
                           
                                                                  'app/components/login-modal/login-modal.component.module.js',
                           
                                                                  'app/components/login-modal/login-modal.component.js',
                           
                                                                  'app/components/login/login.component.module.js',
                           
                                                                  'app/components/login/login.component.js',
                           
                                                                  'app/services/services.module.js',
                           
                                                                  'app/pages/pages.module.js',
                           
                                                                  'app/filters/filters.module.js',
                           
                                                                  'app/components/components.module.js',                        
                           
                                                                  'app/app.js',
                          
                           
                                                                  'app/components/main-menu/main-menu.controller.tests.js',
                           
                                                                  'app/pages/checkout/checkout.controller.tests.js',
                           
                                                                  'app/pages/forgot-password/forgot-password.controller.tests.js',
                           
                                                                  'app/pages/licenses/licenses.controller.tests.js',
                           
                                                                  'app/pages/password-change/password-change.controller.tests.js',
                           
                                                                  'app/pages/renew/renew.controller.tests.js',
                           
                                                                  'app/pages/user-settings/user-settings.controller.tests.js',
                           
                                                                  'app/core/resources/account/account.service.tests.js',
                           
                                                                  'app/core/resources/license/license.service.tests.js',
                           
                                                                  'app/pages/licenses/details/licenses.details.controller.tests.js',
                           
                                                                  'app/pages/licenses/individuals/licenses.individuals.controller.tests.js'

                           
                                                                ],

        frameworks: ["mocha", "chai",],
        plugins: [
            "karma-spec-reporter",
            "karma-mocha",
            "karma-chai",
            "karma-phantomjs-launcher",
            "karma-chrome-launcher",
            "karma-coverage",
            "karma-teamcity-reporter"
        ],

        /**
     * How to report, by default.
     */
        reporters: ["spec", "coverage"],

        /**
     * Show colors in output?
     */
        colors: true,

        /**
     * On which port should the browser connect, on which port is the test runner
     * operating, and what is the URL path for the browser to use.
     */
        port: 9099,
        runnerPort: 9100,
        urlRoot: "/",

        /**
     * Disable file watching by default.
     */
        autoWatch: false,

        /**
     * The list of browsers to launch to test on. This includes only "Firefox" by
     * default, but other browser names include:
     * Chrome, ChromeCanary, Firefox, Opera, Safari, PhantomJS
     *
     * Note that you can also use the executable name of the browser, like "chromium"
     * or "firefox", but that these vary based on your operating system.
     *
     * You may also leave this blank and manually navigate your browser to
     * http://localhost:9099/ when you're running tests. The window/tab can be left
     * open and the tests will automatically occur there during the build. This has
     * the aesthetic advantage of not launching a browser every time you save.
     */
        browsers: [
            "Chrome"
        ],

        preprocessors: {
            'src/app/**/!(*.tests|*-templates).js': "coverage"
        },

        coverageReporter: {
            dir: "coverage/",
            reporters: [
                { type: "html" },
                { type: "teamcity", subdir: ".", file: "teamcity.txt" }
            ]
        }
    });
};