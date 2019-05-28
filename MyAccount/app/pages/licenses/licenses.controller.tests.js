describe('LicensesController', function () {

    var $httpBackend;
    var ctrl;

    var mockStateProvider = {
        $current: {
            self: {
                name: 'licenses'
            }
        },
        go: chai.spy()
    };
   
    var mockLicenses = [
      {
          licenseSeq: 1234,
          licenseStatus: 'NOTICE'
      },
      {
          licenseSeq: 5678,
          licenseStatus: 'NOTICE2'
      }
    ];

    var mockAuthSettings = {
        apiServiceBaseUri: '/mock/api/path'
    }

    beforeEach(module(function ($provide) {
        $provide.value('authSettings', mockAuthSettings);
    }));

    beforeEach(module('portal.pages.licenses'));

    beforeEach(inject(function (_$httpBackend_) {
        $httpBackend = _$httpBackend_;

        inject(function ($controller) {
            ctrl = $controller('LicensesController', {
                '$state': mockStateProvider,
                'licenses': mockLicenses
            });
        });
    }));

    describe('new row selected', function () {
        beforeEach(function () {
            ctrl.licenses[0].isSelected = true;
            ctrl.licenses[1].isSelected = true;
        });

        it('should unselect all other rows', function () {
            ctrl.onSelect(mockLicenses[0], true);
            expect(ctrl.licenses[0].isSelected).to.equal(true);
            expect(ctrl.licenses[1].isSelected).to.equal(false);
        });

        it('should navigate to license details', function () {
            ctrl.onSelect(mockLicenses[0], true);
            expect(mockStateProvider.go).to.have.been.called.with('licenses.details', { 'id': mockLicenses[0].licenseSeq });
        });
    });
});