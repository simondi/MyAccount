describe('PasswordChangeController', function() {

    var createController;
    var $q;
    var $rootScope;
    var $scope;

    beforeEach(module('portal.pages.passwordChange'));

    var mockUserService = {
        changePassword: chai.spy(function () {
            var deferred = $q.defer();
            deferred.resolve();
            return {
                $promise: deferred.promise
            };
        })
    };

    var mockIdentityCache = {
        setIdentity: chai.spy(),
        clearAccessTokens: chai.spy()
    };

    var mockStateProvider = {
        go: chai.spy()
    };

    var mockConfirmService = {};
    var mockStateParams = {};

    beforeEach(inject(function (_$q_, _$rootScope_) {
        $q = _$q_;
        $rootScope = _$rootScope_;
        
        inject(function ($controller) {
            $scope = $rootScope.$new();
            createController = function () {
                return $controller('PasswordChangeController', {
                    '$state': mockStateProvider,
                    '$stateParams': mockStateParams,
                    'User': mockUserService,
                    'Confirm': mockConfirmService,
                    'IdentityCache': mockIdentityCache
                });
            }
        });
    }));

    it('should initialize the controller', function () {
        mockStateParams.id = 'mock-user-id';
        mockStateParams.token = 'mock-invitation-token';
        var ctrl = createController();

        expect(ctrl.password).to.be.empty;
        expect(ctrl.newPassword).to.be.empty;
        expect(ctrl.confirmNewPassword).to.be.empty;
        expect(ctrl.messages).to.be.empty;
        expect(ctrl.isTokenRedeem).to.be.true;
        expect(ctrl.token).to.equal('mock-invitation-token');
        expect(ctrl.userId).to.equal('mock-user-id');
    });

    it('should invoke the service with a token', function () {
        mockStateParams.tokenType = 'invitation';
        var ctrl = createController();

        ctrl.password = '';
        ctrl.newPassword = 'new-password';
        ctrl.confirmNewPassword = 'confirm-new-password';
        ctrl.token = 'mock-token';
        ctrl.userId = 'mock-user-id';

        ctrl.onSubmitClicked();

        var expectedData = {
            id: 'mock-user-id',
            newPassword: 'new-password',
            confirmNewPassword: 'confirm-new-password',
            token: 'mock-token',
            tokenType: 'invitation'
        };

        expect(mockUserService.changePassword).to.have.been.called.with(expectedData);
    });

    it('should invoke the service with a password', function () {
        mockStateParams.token = '';
        var ctrl = createController();

        ctrl.password = 'password';
        ctrl.newPassword = 'new-password';
        ctrl.confirmNewPassword = 'confirm-new-password';

        mockIdentityCache.identity = chai.spy(function() {
            return {
                id: 'mock-user-id'
            };
        });

        ctrl.onSubmitClicked();

        var expectedData = {
            id: 'mock-user-id',
            password: 'password',
            newPassword: 'new-password',
            confirmNewPassword: 'confirm-new-password'
        };

        expect(mockUserService.changePassword).to.have.been.called.with(expectedData);
    });

    describe('when the password change succeeds', function () {
        beforeEach(function() {
            mockConfirmService.showConfirm = chai.spy(function () {
                var deferred = $q.defer();
                deferred.resolve();
                return deferred.promise;
            });
        });

        it('should show a confirm dialog', function() {
            var ctrl = createController();
            ctrl.onSubmitClicked();
            $scope.$digest();

            expect(mockConfirmService.showConfirm).to.have.been.called;
        });

        it('should clear the identity cache', function() {
            var ctrl = createController();
            ctrl.onSubmitClicked();

            $scope.$digest();
            expect(mockIdentityCache.setIdentity).to.have.been.called.with(null);
            expect(mockIdentityCache.clearAccessTokens).to.have.been.called;
        });

        it('should navigate to the login screen', function() {
            var ctrl = createController();
            expect(mockStateProvider.go).to.have.been.called.with('login');
        });
    });

    describe('when the password change succeeds', function () {
        beforeEach(function() {
            mockUserService.changePassword = chai.spy(function() {
                var deferred = $q.defer();

                // Simulate validation error structure returned by Asp.Net
                deferred.reject({
                    data: {
                        prop1: [
                            {
                                ErrorMessage: 'prop1 error 1'
                            }
                        ],
                        prop2: [
                            {
                                ErrorMessage: 'prop2 error 1'
                            },
                            {
                                ErrorMessage: 'prop2 error 2'
                            }
                        ]
                    }
                });

                return {
                    $promise: deferred.promise
                };
            });
        });

        it('should set the messages property', function () {
            var ctrl = createController();
            ctrl.onSubmitClicked();
            $scope.$digest();

            expect(ctrl.messages.length).to.equal(3);
            expect(ctrl.messages[0]).to.equal('prop1 error 1');
            expect(ctrl.messages[1]).to.equal('prop2 error 1');
            expect(ctrl.messages[2]).to.equal('prop2 error 2');
        });
    });
});