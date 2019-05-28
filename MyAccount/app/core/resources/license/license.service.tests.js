describe('license.service', function () {
    var $httpBackend, License;

    beforeEach(module('portal.core.resources.license'));

    var mockAuthSettings = {
        apiServiceBaseUri: '/mock/api/path'
    }

    beforeEach(module(function($provide){
        $provide.value('authSettings', mockAuthSettings);
    }));

    beforeEach(inject(function (_$httpBackend_, _License_) {
            $httpBackend = _$httpBackend_;
            License = _License_;
        })
    );
   
   var mockLicenses = [
     {
         licenseNumber: '1234'
     },
     {
         licenseNumber: '5678'
     }
   ];
      
   it('should request a list of licences', function () {
       $httpBackend.expect('GET', mockAuthSettings.apiServiceBaseUri + '/api/License').respond(200, mockLicenses);
      License.query().$promise.then(function (licenses) {
          expect(licenses.length).to.equal(2);
      });
      $httpBackend.flush();      
   });
   
   it('should return a single license', function () {
       $httpBackend.expect('GET', mockAuthSettings.apiServiceBaseUri + '/api/License/1').respond(200, mockLicenses[0]);
       License.get({ id: 1 }).$promise.then(function (license) {
           expect(license.licenseNumber).to.equal(mockLicenses[0].licenseNumber);
      });
      $httpBackend.flush();      
   });
});