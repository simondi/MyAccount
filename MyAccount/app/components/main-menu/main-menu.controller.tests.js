describe('MainMenuController', function () {

    var scope;
    var $httpBackend;

    var mockStateProvider = {
        go: chai.spy()
    };

    var mockAuthSettings = {
        apiServiceBaseUri: 'http://mock.api.path/'
    };

    var mockIdentityCache = {
        setIdentity: chai.spy(),
        setAccessTokens: chai.spy(),
        clearAccessTokens: chai.spy()
    };
    
    beforeEach(module('portal.components.main-menu'));
    beforeEach(module('portal.core.resources.user'));

    beforeEach(module(function ($provide) {
        $provide.value('authSettings', mockAuthSettings);
        $provide.value('IdentityCache', mockIdentityCache);
    }));

    beforeEach(inject(function (_$httpBackend_) {
        $httpBackend = _$httpBackend_;
        $httpBackend.when('GET', 'app/assets/json/version.json').respond({});

        inject(function ($rootScope, $controller) {

            createController = function () {
                scope = $rootScope.$new();

                return $controller('MainMenuController', {
                    '$scope': scope,
                    '$state': mockStateProvider
                });
            }
        });
    }));

    describe('logged out', function () {
        beforeEach(function () {
            createController();
        });

        it('should navigate to login', function () {
            $httpBackend.expect('POST', mockAuthSettings.apiServiceBaseUri + 'api/Account/Logout').respond();
            scope.logOut();
            $httpBackend.flush();
            expect(mockStateProvider.go).to.have.been.called.with('login');
        });

        it('should clear the user from cache', function () {
            $httpBackend.expect('POST', mockAuthSettings.apiServiceBaseUri + 'api/Account/Logout').respond();
            scope.logOut();
            $httpBackend.flush();
            expect(mockIdentityCache.setIdentity).to.have.been.called.with(null);
        });
    });
});