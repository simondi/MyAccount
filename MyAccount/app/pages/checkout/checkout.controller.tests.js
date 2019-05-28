describe('CheckoutController', function () {

    var $httpBackend, $rootScope, $q;
    var ctrl;

    var mockToast = {
        create: chai.spy()
    };

    var mockStateProvider = {
        go: chai.spy()
    };

    var mockPreviousStateProvider = {
        Name: "Test",
        Params: {}
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
        licensesToRenew: mockLicenses,
        order: {
            orderId: 1
        }
    };

    var mockAuthSettings = {
        apiServiceBaseUri: '/mock/api/path'
    };

    var mockOrderService = {
        processRenewal: chai.spy(function () {
            var deferred = $q.defer();
            deferred.resolve();
            return {
                $promise: deferred.promise
            };
        })
    };

    beforeEach(module(function ($provide) {
        $provide.value('authSettings', mockAuthSettings);
    }));

    beforeEach(module('portal.pages.checkout'));

    beforeEach(inject(function (_$q_, _$httpBackend_, _$rootScope_) {
        $q = _$q_;
        $httpBackend = _$httpBackend_;
        $rootScope = _$rootScope_;

        inject(function ($rootScope, $controller) {
            scope = $rootScope.$new();

            ctrl = $controller('RenewalCheckoutController', {
                '$state': mockStateProvider,
                '$scope': scope,
                '$stateParams': mockStateParamsProvider,
                'Order': mockOrderService,
                'ngToast': mockToast,
                'PreviousState': mockPreviousStateProvider
            });
        });
    }));

    describe('confirm and pay', function () {
        beforeEach(function () {
            ctrl.order = {
                orderId: 1,
                total: 1000,
                items: [
                {
                    description: 'test 4444 - test',
                    amount: 1000,
                    licenseNumber: 4444
                }],
                declarationTitle: 'title',
                declarationName: 'name'
            }

            ctrl.renewalInfo = {
                orderId: 1,
                declarationTitle: 'title',
                declarationName: 'name'
            };

            ctrl.paymentInfo = {
                cardHolderName: 'Jeremy'
            };

            mockOrderService.process = chai.spy(function () {
                var deferred = $q.defer();
                deferred.resolve();
                return {
                    $promise: deferred.promise
                };
            });
        });

        it('should process the order and return home', function () {
            ctrl.confirmAndPay();
            $rootScope.$digest();

            expect(mockOrderService.processRenewal).to.have.been.called.with(ctrl.renewalInfo);
            expect(mockToast.create).to.have.been.called();
            expect(mockStateProvider.go).to.have.been.called.with('licenses');
        });
    });
});