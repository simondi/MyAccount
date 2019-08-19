angular.module('portal.pages.licenses.financialReview')
    .controller('LicensesFinancialReviewController', function ($scope, $state, $stateParams, license, 
        financialReviews, lodash, uibDateParser, Confirm, $uibModal, FinancialReviewDefinitionService) {
        'use strict';

        var ctrl = this;

        ctrl.title = 'Financial Review';
        ctrl.definitions = FinancialReviewDefinitionService;
        ctrl.license = license;
        ctrl.isANewBusiness = license.isANewBusiness;
        ctrl.financialReviews = financialReviews;
        ctrl.dateFormat = 'yyyy-MM-dd';
        ctrl.yesNoOptions = [
            { display: 'No', value: false },
            { display: 'Yes', value: true }
        ];

        $scope.$parent.ctrl.selectCurrentRow($stateParams.id, ctrl.license);

        ctrl.selectedLocationChanged = function () {
            if (!ctrl.selectedLocation) {
                ctrl.review = null;
            } else {

                ctrl.review = lodash(financialReviews).find({ id: ctrl.selectedLocation.id });
            }
            if (ctrl.review) {
                ctrl.review.loanDataFrom = uibDateParser.parse(ctrl.review.loanDataFrom, ctrl.dateFormat);
                ctrl.review.loanDataTo = uibDateParser.parse(ctrl.review.loanDataTo, ctrl.dateFormat);
                // If the financial reviews has been submitted, it is not editable.
                ctrl.isReadOnly = ctrl.review.dateReviewed;
            }
        };
        ctrl.locations = lodash(ctrl.financialReviews).map(function(review) {
            return {
                id: review.id,
                location: review.dataForLocation
            };
        }).value();

        ctrl.selectedLocation = ctrl.locations ? ctrl.locations[0] : undefined;
        ctrl.selectedLocationChanged();

        ctrl.openLoanStartDatePicker = function() {
            ctrl.isLoanStartDatePickerOpen = true;
        };

        ctrl.openLoanEndDatePicker = function() {
            ctrl.isLoanEndDatePickerOpen = true;
        };

        ctrl.showValidationErrors = function (response) {
            // strip keys to the final "." expression, concatenating as necessary
            ctrl.modelState = lodash(response.data.modelState).reduce(function(result, value, key) {
                var idx = key.lastIndexOf('.');
                var newKey = key.substr(idx + 1);
                result[newKey] = (result[newKey] || []).concat(value);
                return result;
            }, {});

            Confirm.showConfirm('Financial Review', 'There were errors validating the data. Please check your entries.',
            { showCancel: false });
        };

        ctrl.submit = function() {
            Confirm.showConfirm('Submit Financial Review', 'Are you sure you want to submit the financial review data? ' +
                    'It can not be edited after submission.')
                .then(function() {
                    var postData = angular.copy(ctrl.review);
                    postData.licenseId = ctrl.license.licenseSeq;
                    postData.$save()
                        .then(function(response) {
                            ctrl.modelState = undefined;
                            angular.copy(response, ctrl.review);
                            ctrl.selectedLocationChanged(); // to force binding to update
                            ctrl.onClickForPopup('app/pages/licenses/financial-review/submitSuccesful.html');
                            //Confirm.showConfirm('Complete', 'Your financial report has been saved and can no longer be edited.',{ showCancel: false });
                        })
                        .catch(ctrl.showValidationErrors);
                });
        };

        ctrl.saveDraft = function() {
            var postData = angular.copy(ctrl.review);
            postData.licenseId = ctrl.license.licenseSeq;
            postData.$saveDraft()
                .then(function() {
                    Confirm.showConfirm('Financial Review', 'The draft has been saved. Don\'t forget to submit the form when complete.',
                    { showCancel: false });
                });
        };

        ctrl.backToLicenses = function () {
            $state.go('licenses');
        }

        ctrl.checkForm = function() {
            var postData = angular.copy(ctrl.review);
            postData.licenseId = ctrl.license.licenseSeq;
            postData.$checkForm()
                .then(function() {
                    ctrl.modelState = undefined;
                    Confirm.showConfirm('Financial Review', 'The information entered is valid. You may submit this form when ready.',
                    { showCancel: false });
                })
                .catch(ctrl.showValidationErrors);
                };

        //popup for all with different url content
        ctrl.onClickForPopup = function (url) {
            var modal4 = $uibModal.open({
                templateUrl: url,
                controller: 'PopupController',
                controllerAs: '$ctrl',
                size: 'lg'
            });
        };
    });