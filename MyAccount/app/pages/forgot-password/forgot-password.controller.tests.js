describe('ForgotPasswordController', function() {

    var createController;
    var $q;
    var $rootScope;
    var $scope;

    beforeEach(module('portal.pages.forgotPassword'));

    var mockUserService;

    var mockStateProvider = {
        go: chai.spy()
    };

    var mockConfirmService = {};
    var mockStateParams = {};

    beforeEach(inject(function (_$q_, _$rootScope_) {
        $q = _$q_;
        $rootScope = _$rootScope_;

        mockStateParams.email = 'mock-email-address';

        mockConfirmService.showConfirm = chai.spy(function() {
            return $q.resolve();
        });

        mockUserService = {
            resetPassword: chai.spy()
        };

        inject(function ($controller) {
            $scope = $rootScope.$new();
            createController = function () {
                return $controller('ForgotPasswordController', {
                    'User': mockUserService,
                    '$state': mockStateProvider,
                    '$stateParams': mockStateParams,
                    'Confirm' : mockConfirmService
                });
            }
        });
    }));

    it('should initialize the controller', function () {
        var ctrl = createController();
        expect(ctrl.email).to.equal(mockStateParams.email);
        expect(ctrl.message).to.be.empty;
    });

    it('should show a confirmation modal', function() {
        var ctrl = createController();
        ctrl.onPasswordResetClicked();
        expect(mockConfirmService.showConfirm).to.have.been.called;
    });

    describe('when the user accepts the confirm dialog', function() {

        beforeEach(function() {
            mockUserService.resetPassword = chai.spy(function () {
                return {
                    $promise: $q.resolve()
                };
            });

            var ctrl = createController();
            ctrl.onPasswordResetClicked();
            $scope.$digest();
        });

        it('should call the service', function () {
            var expectedData = {
                email: mockStateParams.email
            };
            expect(mockUserService.resetPassword).to.have.been.called.with(expectedData);
        });

        it('should show a second confirmation dialog', function() {
            expect(mockConfirmService.showConfirm).to.have.been.called.twice;
        });
    });

    describe('when the service call fails', function() {
        var ctrl;

        beforeEach(function() {
            mockUserService.resetPassword = chai.spy(function() {
                return {
                    $promise: $q.reject({ statusText: 'mock-status-text' })
                };
            });

            ctrl = createController();
            ctrl.onPasswordResetClicked();
            $scope.$digest();
        });

        it('should set the error message', function() {
            expect(ctrl.message).to.equal('mock-status-text');
        });
    });

    describe('when the user declines the confirmation modal', function () {
        var ctrl;

        beforeEach(function() {
            mockConfirmService.showConfirm = chai.spy(function() {
                return $q.reject();
            });
            ctrl = createController();
            ctrl.onPasswordResetClicked();
            $scope.$digest();
        });

        it('should not call the service', function() {
            expect(mockUserService.resetPassword).to.have.not.been.called;
        });
    });
});