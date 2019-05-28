describe('UserSettingsController', function() {

    var createController;
    var $rootScope;
    var $scope;
    var $q;
    
    beforeEach(module('portal.pages.userSettings'));

    var mockConfirmService;
    var mockCurrentUser;
    var mockFormController;

    var mockToast = {
        create: chai.spy()
    };

    beforeEach(inject(function(_$q_, _$rootScope_) {
        $q = _$q_;
        $rootScope = _$rootScope_;

        mockCurrentUser = { 
            id: 'mock-user-id',
            email: 'mock-user-email',
            $save: chai.spy(function() {
                return $q.resolve();
            })
        };

        mockConfirmService = {
            showConfirm: chai.spy(function() {
                return $q.resolve();
            })
        };

        mockFormController = {
            $setPristine: chai.spy()
        };

        inject(function ($controller) {
            $scope = $rootScope.$new();

            createController = function() {
                return $controller('UserSettingsController', {
                    'Confirm': mockConfirmService,
                    'currentUser': mockCurrentUser,
                    'ngToast': mockToast
                });
            }
        });
    }));

    it ('should initialize the controller', function() {
        var ctrl = createController();

        expect(ctrl.user).to.deep.equal(mockCurrentUser);
        expect(ctrl.message).to.be.empty;
    });

    describe('when the user rejects the confirm disalog', function() {

        beforeEach(function() {
            mockConfirmService.showConfirm = chai.spy(function() {
                return $q.reject();
            });
            var ctrl = createController();
            ctrl.onChangeEmailClicked(mockFormController);
        });

        it('should not call the service', function() {
            expect(mockCurrentUser.$save).not.to.have.been.called;
        });
    });

    describe('when change email succeeds', function () {
        var ctrl;
        var savedUser = {
            id: 'mock-saved-user-id',
            email: 'mock-saved-user-email'
        };
        
        beforeEach(function() {
            mockConfirmService.showConfirm = chai.spy(function() {
                return $q.resolve();
            });

            mockCurrentUser.$save = chai.spy(function() {
                return $q.resolve(savedUser);
            });

            ctrl = createController();
            ctrl.onChangeEmailClicked(mockFormController);
            $scope.$digest();
        });

        it('should invoke the service', function() {
            expect(mockCurrentUser.$save).to.have.been.called;
        });

        it('should clean the form', function () {
            expect(mockFormController.$setPristine).to.have.been.called;
        });

        it('should set the user to the result', function () {
            expect(ctrl.user).to.deep.equal(savedUser);
        });

        it('should show a notification', function() {
            expect(mockToast.create).to.have.been.called;
        });
    });

    describe('when change email fails', function () {
        var ctrl;

        beforeEach(function() {
            mockConfirmService.showConfirm = chai.spy(function() {
                return $q.resolve();
            });

            mockCurrentUser.$save = chai.spy(function() {
                return $q.reject({statusText: 'mock-error-message'});
            });

            ctrl = createController();
            ctrl.onChangeEmailClicked(mockFormController);
            $scope.$digest();
        });

        it('should set the error message', function () {
            expect(ctrl.message).to.equal('mock-error-message');
        });
    });
});