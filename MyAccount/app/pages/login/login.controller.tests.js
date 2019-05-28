describe('LoginController', function() {

    var $httpBackend;
    var scope;

    var mockStateProvider = {
        go: chai.spy()
    };

    var mockAuthSettings = {
        apiServiceBaseUri: 'http://mock.api.path/'
    };

    var mockIdentityCache = {
        setIdentity: chai.spy(),
        setAccessTokens: chai.spy(),
        clearAccessTokens: chai.spy(),
        hasRole: chai.spy()
    };

    beforeEach(module('portal.pages.login'));

    beforeEach(module(function ($provide) {
        $provide.value('authSettings', mockAuthSettings);
        $provide.value('IdentityCache', mockIdentityCache);
    }));

    beforeEach(inject(function(_$httpBackend_) {
        $httpBackend = _$httpBackend_;
        $httpBackend.when('GET', mockAuthSettings.apiServiceBaseUri + 'api/Account/Identity').respond({});
        
        inject(function ($rootScope, $controller) {

            createController = function () {
                scope = $rootScope.$new();

                return $controller('LoginController', {
                    '$scope': scope,
                    '$state': mockStateProvider
                });
            }
        });
    }));

    it('should initialize the scope', function() {
        createController();
        expect(scope.loginData).to.not.be.null;
    });

    describe('successful login', function () {
        var mockLogin = "my@login.com";
        var mockPassword = "hunter2";
        var mockRememberMe = true;

        beforeEach(function() {
            createController();
            scope.loginData = {
                userName: mockLogin,
                password: mockPassword
            };
        });

        it('should invoke the service', function() {
            $httpBackend.expect('POST', mockAuthSettings.apiServiceBaseUri + 'Token').respond({});
            scope.login();
            $httpBackend.flush();
            $httpBackend.verifyNoOutstandingExpectation();
        });

        it('should navigate to licenses', function () {
            $httpBackend.expect('POST', mockAuthSettings.apiServiceBaseUri + 'Token').respond({
                access_token: 'access',
                refresh_token: 'refresh'
            });
            scope.login();
            $httpBackend.flush();
            expect(mockStateProvider.go).to.have.been.called.with('licenses');
        });

        it('should cache the access tokens', function () {
            var mockUser = { email: 'foo@bar.com' };
            $httpBackend.expect('POST', mockAuthSettings.apiServiceBaseUri + 'Token').respond({
                access_token: 'access token',
                refresh_token: 'refresh token'
            });
            scope.login();
            $httpBackend.flush();
            expect(mockIdentityCache.setAccessTokens).to.have.been.called.with('access token', 'refresh token');
        });
    });

    describe('failed login', function() {
        it('should set the error message', function() {
            createController();

            var mockErrorMsg = 'mock error message';
            $httpBackend.expect('POST', mockAuthSettings.apiServiceBaseUri + 'Token').respond(403, {error_description: mockErrorMsg}, {}, '');
            scope.login();
            $httpBackend.flush();
            $httpBackend.verifyNoOutstandingExpectation();

            expect(scope.message).to.equal(mockErrorMsg);
        });
    });
});