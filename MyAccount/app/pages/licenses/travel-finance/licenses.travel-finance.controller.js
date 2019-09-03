angular.module('portal.pages.licenses.travelFinance')
    .controller('LicensesTravelFinanceController', function ($scope, $stateParams, license, travelFinances, lodash, uibDateParser,
        Confirm, TravelFinanceDefinitionService, $uibModal, $timeout, $state, Order, moment) {
        'use strict';
        var ctrl = this;

        ctrl.title = 'Travel Finance';
        ctrl.isNewLicense = false;
        ctrl.isReadOnly = false;
        ctrl.license = license;
        ctrl.isTrustAccountInBC = null;
        ctrl.canSubmitFinancialReport = false;
        ctrl.definitions = TravelFinanceDefinitionService;
        ctrl.travelFinances = travelFinances;
        ctrl.dateFormat = 'yyyy-MM-dd';
        ctrl.licenseSubType = 'Travel Agent';
        ctrl.yesNoOptions = [
            { display: 'No', value: false },
            { display: 'Yes', value: true }
        ];
        ctrl.isTravelAgentOrWholeSeller = 1;
        ctrl.requiredSecurity = 0;
        ctrl.tafItemNo = 9;
        ctrl.onHoliday = false;
        ctrl.ownTAF = false;
        ctrl.IsTAFPaid = false;
        ctrl.IsExtended = false;
        ctrl.lateFilingFeeApply = false;
        ctrl.IsLateFeePaid = true;
        ctrl.headOfficeSeq = 10;    // Initialized as branch office which Financial report is not needed,  
        // BUSINESS_SEQ ==10 does exist only as Christ Church Cemetery, not travel agent
        // ctrl.headOfficeSeq = 0 => Head Office,    ctrl.headOfficeSeq = 1 => Independent Office, Otherwise, Branch office

        var currentDate = new Date();
        var currentDate0 = currentDate.setHours(0, 0, 0);

        $scope.$parent.ctrl.selectCurrentRow($stateParams.id, ctrl.license);

        ctrl.selectedLocationChanged = function () {
            ctrl.review = lodash(travelFinances).find({ id: ctrl.selectedLocation.id });
            if (ctrl.review) {
                ctrl.isNewLicense = ctrl.review.isNewLicense;
                ctrl.isReadOnly = ctrl.review.submittedOn;
                ctrl.onHoliday = ctrl.review.onHoliday;
                ctrl.IsTAFPaid = ctrl.review.isTAFPaid;
                ctrl.IsExtended = ctrl.review.extendedDate;
                ctrl.headOfficeSeq = ctrl.review.headOfficeSeq;
                ctrl.licenseSubType = ctrl.review.licenseSubType;
                ctrl.ownTAF = ctrl.review.amountTAF > 0;

                // retrive latepayment informaiton of late Filing Fee
                var Test0 = uibDateParser.parse(ctrl.review.statementDueDate, ctrl.dateFormat).setHours(23);
                ctrl.lateFilingFeeApply = ctrl.review.submittedOn === null ? currentDate0 > Test0 :  uibDateParser.parse(ctrl.review.submittedOn.substr(0,10), ctrl.dateFormat).setHours(0) > Test0;
                ctrl.IsLateFeePaid = ctrl.review.isLateFeePaid;
                switch (ctrl.licenseSubType) {
                    case 'Travel Agent':
                        ctrl.isTravelAgentOrWholeSeller = 1;
                        ctrl.tafItemNo = 9;
                        break;
                    case 'Travel Wholesaler':
                        ctrl.isTravelAgentOrWholeSeller = 2;
                        ctrl.tafItemNo = 12;
                        break;
                    case 'Mixed Travel Agent/Wholesaler':
                        ctrl.isTravelAgentOrWholeSeller = 3;
                        ctrl.tafItemNo = 14;
                        break;
                    default:
                        ctrl.isTravelAgentOrWholeSeller = 4;
                }
            }
        };
        ctrl.locations = lodash(ctrl.travelFinances).map(function (review) {
            return {
                id: review.id,
                location: review.dataForLocation
            };
        }).value();

        ctrl.selectedLocation = ctrl.locations ? ctrl.locations[0] : undefined;
        ctrl.selectedLocationChanged();

        var dueDate = uibDateParser.parse(ctrl.review.statementDueDate, ctrl.dateFormat);
        var dueDate0 =  uibDateParser.parse(ctrl.review.statementDueDate, ctrl.dateFormat).setHours(23);
        var extendedDate0 = ctrl.IsExtended ? uibDateParser.parse(ctrl.review.extendedDate, ctrl.dateFormat).setHours(23) : dueDate0;
        ctrl.canSubmitFinancialReport = ctrl.IsExtended? 
            (currentDate > uibDateParser.parse(ctrl.review.fiscalYearEndDate, ctrl.dateFormat) && currentDate0 <= extendedDate0) :
            (currentDate > uibDateParser.parse(ctrl.review.fiscalYearEndDate, ctrl.dateFormat) && currentDate0 <= dueDate0);

        ctrl.showValidationErrors = function (response) {
            // strip keys to the final "." expression, concatenating as necessary
            ctrl.modelState = lodash(response.data.modelState).reduce(function (result, value, key) {
                var idx = key.lastIndexOf('.');
                var newKey = key.substr(idx + 1);
                result[newKey] = (result[newKey] || []).concat(value);
                return result;
            }, {});

            Confirm.showConfirm('Travel Financial Report', 'There were errors validating the data. Please check your entries.',
            { showCancel: false });
        };       

        // Calculate TAF
        ctrl.calculateTAF = function () {
            if (ctrl.review.onHoliday) {
                ctrl.review.amountTAF = 0;
            }
            else {
                switch (ctrl.licenseSubType) {
                    case 'Travel Agent':
                        ctrl.review.amountTAF = Math.max(100, Math.round(ctrl.review.totalGrossSaleTA * 0.0005));
                        break;
                    case 'Travel Wholesaler':
                        ctrl.review.amountTAF = Math.max(100, Math.round(ctrl.review.totalGrossSaleWS * 0.0005));
                        break;
                    case 'Mixed Travel Agent/Wholesaler':
                        ctrl.review.amountTAF = 0;
                        var saleTA = 0;
                        var saleWAS = 0;
                        if (ctrl.review.totalGrossSaleTA)
                            saleTA = ctrl.review.totalGrossSaleTA;
                        if (ctrl.review.totalGrossSaleWS)
                            var saleWS = ctrl.review.totalGrossSaleWS;
                        ctrl.review.amountTAF = Math.max(100, Math.round((saleTA + saleWS) * 0.0005));
                        break;
                    default:
                        ctrl.review.amountTAF = 0;
                }
            }
        }

        ctrl.submit = function () {
            if ($scope.financialReview.$invalid) {
                Confirm.showConfirm('Submit Financial Review', 'Please fill in the missing fields which are highlighted in red.');
                var myEl = angular.element(document.querySelector('input.ng-invalid'));
                myEl.css("border", "1px solid red");
            }
            else if (ctrl.isTrustAccountInBC == null) {
                Confirm.showConfirm('Submit Financial Review', 'Please answer the question if your trust account is in BC.');
            }
            else { 
                Confirm.showConfirm('Submit Financial Review', 'Are you sure you want to submit the financial review data? ' +
                        'It can not be edited after submission.')
                    .then(function () {
                        var postData = angular.copy(ctrl.review);
                        postData.licenseId = ctrl.license.licenseSeq;
                        postData.$save()
                            .then(function (response) {
                                ctrl.modelState = undefined;
                                angular.copy(response, ctrl.review);
                                ctrl.isReadOnly = true;
                                // ctrl.selectedLocationChanged(); // to force binding to update: this caue problems with isSubmitted on and ctrl.licenseSubType undefined
                                ctrl.onClickForPopup('app/pages/licenses/travel-finance/popups/submitReportSuccessful.html');
                                //Confirm.showConfirm('Financial Report', 'The financial report data has been saved and can no longer be edited.', { showCancel: false });
                                if (!ctrl.onHoliday || ctrl.lateFilingFeeApply) {
                                    ctrl.pay('TAF');
                                }
                            }).catch(function () {
                                $uibModalInstance.dismiss('cancel');
                            }).catch(ctrl.showValidationErrors);
                    });
            }
        };

        ctrl.saveDraft = function () {
            var postData = angular.copy(ctrl.review);
            postData.licenseId = ctrl.license.licenseSeq;
            postData.$saveDraft()
                .then(function () {
                    Confirm.showConfirm('Financial Report', 'The draft has been saved. Don\'t forget to submit the form when complete.',
                    { showCancel: false });
                });
        };

        ctrl.checkForm = function () {
            var postData = angular.copy(ctrl.review);
            postData.licenseId = ctrl.license.licenseSeq;
            postData.$checkForm()
                .then(function () {
                    ctrl.modelState = undefined;
                    Confirm.showConfirm('Financial Report', 'The information entered is valid. You may submit this form when ready.',
                    { showCancel: false });
                })
                .catch(ctrl.showValidationErrors);
        };

        // When update the asnwer to the question of "Is the trust account in BC?"
        $scope.upTrustAccountResidinginBC = function (text1) {
            ctrl.review.isTrustAccountInBC = ctrl.isTrustAccountInBC;
            Confirm.showConfirm('Business Nature Changes', text1, { showCancel: false });
        }

        // When Yes / No dropdown reselected.
        $scope.updateLicense = function (text1, text2) {
            Confirm.showConfirm('Business Nature Changes',  text1)
               .then(function () {
                   var postData = angular.copy(ctrl.review);
                   postData.licenseId = ctrl.license.licenseSeq;
                   postData.$save()
                       .then(function (response) {
                           ctrl.modelState = undefined;
                           angular.copy(response, ctrl.review);
                           ctrl.selectedLocationChanged(); // to force binding to update
                           Confirm.showConfirm('Business Nature Changes', text2,
                           { showCancel: false });
                       })
                       .catch(ctrl.showValidationErrors);
               });
        }

        // On click the button of paying TAF
        ctrl.pay = function (type) {
            if ($scope.financialReview.$invalid) {
                Confirm.showConfirm('Submit Financial Review', 'Please fill in the missing fields which are highlighted in red.');
                var myEl = angular.element(document.querySelector('input.ng-invalid'));
                myEl.css("border", "1px solid red");
            }
            else {
                var orderItems = [
                    {
                        licenseSeq: ctrl.review.realLicenseSeq, //ctrl.license.licenseSeq,
                        licenseNumber: ctrl.license.licenseNumber,
                        itemSeq: ctrl.review.id,
                        type: type,
                        quantity: 1,
                        amount: ctrl.review.amountTAF
                    }
                ];

                Order.save(orderItems).$promise.then(function (order) {
                    $state.go('tafPaymentCheckout', { order: order, tafPaymentInfo: ctrl.review });
                }).catch(function (response) {
                    console.log(response);
                    ctrl.message = response.statusText;
                });
            }
        };

        ctrl.backToLicenses = function () {
            $state.go('licenses');
        }
 
        //popup for all with different url content
        ctrl.onClickForPopup = function (url) {
            var modal3 = $uibModal.open({
                templateUrl: url,
                controller: 'PopupController',
                controllerAs: '$ctrl',
                size: 'lg'
            });
        };
    });