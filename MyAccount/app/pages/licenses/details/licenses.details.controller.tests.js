describe('LicensesDetailsController', function () {

    var $q;
    var ctrl;

    var mockConfirmProvider = {
        showConfirm: function() {}
    }

    var mockStateProvider = {
        go: chai.spy()
    };

    var mockStateParamsProvider = {
        id: 1234
    };

    var mockLicenseService;

    var mockLicenses = [
        {
            licenseSeq: 1234,
          getContactFullName: chai.spy(function() { return 'Contact Full Name' }),
          getLocationAddress: chai.spy(function() { return 'Location Address' }),
          getMailingAddress: chai.spy(function() { return 'Mailing Address' }),
          getHeadOfficeAddress: chai.spy(function () { return 'Head Office Address' }),
          getPhoneNumber: chai.spy(function () { return 'Phone Number' })
      },
      {
          licenseSeq: 5678
      }
    ];

    var mockAuthSettings = {
        apiServiceBaseUri: '/mock/api/path'
    }

    beforeEach(module(function ($provide) {
        $provide.value('authSettings', mockAuthSettings);
    }));

    beforeEach(module('portal.pages.licenses.details'));

    beforeEach(inject(function (_$q_) {
        $q = _$q_;

        mockLicenseService = {};

        inject(function ($rootScope, $controller) {
            scope = $rootScope.$new();

            mockLicenses[0].isSelected = false;
            mockLicenses[1].isSelected = false;
            scope.$parent = {
                 ctrl: {
                     licenses: mockLicenses,
                     selectCurrentRow: chai.spy()
                 }
            };

            ctrl = $controller('LicensesDetailsController', {
                '$scope': scope,
                '$state': mockStateProvider,
                '$stateParams': mockStateParamsProvider,
                'license': mockLicenses[0],
                'License': mockLicenseService,
                'Confirm': mockConfirmProvider
            });
        });
    }));

    describe('page initialized', function () {
        it('calculated values should be set', function () {
            ctrl.init();
            expect(ctrl.contactFullName).to.equal('Contact Full Name');
            expect(ctrl.locationAddress).to.equal('Location Address');
            expect(ctrl.mailingAddress).to.equal('Mailing Address');
            expect(ctrl.headOfficeAddress).to.equal('Head Office Address');
            expect(ctrl.phoneNumber).to.equal('Phone Number');
            
            expect(scope.$parent.ctrl.selectCurrentRow).to.have.been.called();
        });
    });

    describe('edit button clicked', function () {
        it('should initialize save state variables', function () {
            ctrl.initEdit();
            expect(ctrl.saveWasSuccessful).to.equal(false);
            expect(ctrl.saveError).to.equal('');
            expect(ctrl.isEditing).to.equal(true);
        });
    });
    
    describe('save button clicked', function () {
        beforeEach(function () {
            mockLicenseService.update = chai.spy(function () {
                return {
                    $promise: $q.resolve(mockLicenses[0])
                };
            });

            scope.editForm = { '$valid': true };
            ctrl.saveWasSuccessful = false;
            ctrl.saveError = '';
            ctrl.isEditing = true;
        });

        it('should correctly set variables after successful save', function () {
            ctrl.save();
            scope.$digest();

            expect(ctrl.saveWasSuccessful).to.equal(true);
            expect(ctrl.saveError).to.equal('');
            expect(ctrl.isEditing).to.equal(false);
        });
    });
    
    describe('save button clicked', function () {
        beforeEach(function () {
            mockLicenseService.update = chai.spy(function () {
                return {
                    $promise: $q.reject({ status: 500, statusText: 'save error' })
                };
            });

            scope.editForm = { '$valid': true };
            ctrl.saveWasSuccessful = false;
            ctrl.saveError = '';
            ctrl.isEditing = true;
        });

        it('should correctly set variables after unsuccessful save', function () {
            ctrl.save();
            scope.$digest();

            expect(ctrl.saveWasSuccessful).to.equal(false);
            expect(ctrl.saveError).to.equal('Error 500: save error');
            expect(ctrl.isEditing).to.equal(true);
        });
    });

    describe('cancel button clicked', function () {
        it('should reset save state variables', function () {
            ctrl.reset();
            expect(ctrl.saveWasSuccessful).to.equal(false);
            expect(ctrl.saveError).to.equal('');
            expect(ctrl.isEditing).to.equal(false);
        });
    });

    describe('renew button clicked', function () {
        it('should change to the renew state', function () {
            ctrl.renew();
            expect(mockStateProvider.go).to.have.been.called.with('renew', { licensesToRenew: [mockLicenses[0]] });
        });
    });
});