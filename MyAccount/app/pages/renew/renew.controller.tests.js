describe('RenewController', function () {

    var $httpBackend, $rootScope, $q;
    var ctrl;

    var mockStateProvider = {
        go: chai.spy()
    };

    var mockLicenses = [
        {
            licenseSeq: 1234,
            licenseTypeSeq: 4321,
            licenseTypeDesc: 'test',
            licenseNumber: 4444
        }
    ];

    var mockStateParamsProvider = {
        licensesToRenew: mockLicenses
    };

    var mockAuthSettings = {
        apiServiceBaseUri: '/mock/api/path'
    };

    var mockOrder = {
        orderId: 1,
        declarationTitle: 'Mr',
        declarationName: 'Jeremy'
    };

    var mockOrderService = {
        save: chai.spy()
    };

    beforeEach(module(function ($provide) {
        $provide.value('authSettings', mockAuthSettings);
    }));

    beforeEach(module('portal.pages.renew'));

    beforeEach(inject(function (_$q_, _$rootScope_) {
        $q = _$q_;
        $rootScope = _$rootScope_;

        inject(function ($rootScope, $controller) {
            scope = $rootScope.$new();

            ctrl = $controller('RenewController', {
                '$scope': scope,
                '$state': mockStateProvider,
                '$stateParams': mockStateParamsProvider,
                'Order': mockOrderService
            });
        });
    }));
    
    describe('check checkout eligibility', function () {
        beforeEach(function() {
            scope.renewForm = { '$valid': true };
        });

        it('should be elegible when form is valid', function () {
            ctrl.renewalInfo.criminalConviction = true;
            ctrl.renewalInfo.officerChanges = true;
            ctrl.renewalInfo.ownershipChanges = false;
            expect(ctrl.canCheckout()).to.equal(true);
        });

        it('should be inelegible when form is invalid', function () {
            expect(ctrl.canCheckout()).to.equal(false);
        });
    });

    describe('create order', function () {
        beforeEach(function () {
            ctrl.declarationTitle = 'title';
            ctrl.declarationName = 'name';
            ctrl.licenses = mockLicenses;
            
            mockOrderService.save = chai.spy(function () {
                var deferred = $q.defer();
                deferred.resolve(mockOrder);
                return {
                    $promise: deferred.promise
                };
            });
        });

        it('should create the expected order', function () {
            var orderItems = [
            {
                licenseSeq: 1234,
                licenseNumber: 4444,
                type: 'Renewal',
                quantity: 1
            }];

            ctrl.checkout();
            $rootScope.$digest();

            expect(mockOrderService.save).to.have.been.called().with(orderItems);
            expect(mockStateProvider.go).to.have.been.called.with('renewalCheckout', { order: mockOrder, renewalInfo: ctrl.renewalInfo });
        });
    });
});