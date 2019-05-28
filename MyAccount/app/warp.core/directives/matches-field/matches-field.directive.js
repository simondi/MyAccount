angular.module('warp.directives.matches-field')
    .directive('matchesField', function () {
        'use strict';
        'ngInject';
        return {
            restrict: 'A',
            require: 'ngModel',
            scope: {
                otherField: '@matchesField'
            },
            link: function (scope, element, attribute, modelController) {
                var fieldsMatch = function () {
                    return otherFieldModelValueAccessor() === modelController.$modelValue;
                };

                var otherFieldModelValueAccessor = function () {
                    if (modelController.$$parentForm[scope.otherField]) {
                        return modelController.$$parentForm[scope.otherField].$modelValue;
                    }
                    return undefined;
                };

                scope.$watch(otherFieldModelValueAccessor, function () {
                    modelController.$setValidity('matchesField', fieldsMatch());
                });

                scope.$watch(function () {
                    return modelController.$modelValue;
                }, function () {
                    modelController.$setValidity('matchesField', fieldsMatch());
                });
            }
        };
    });