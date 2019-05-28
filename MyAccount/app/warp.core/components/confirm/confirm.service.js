angular.module('warp.components.confirm')
    .factory('Confirm', function ($uibModal) {
        'use strict';
        'ngInject';

        var template = 
            '<div class="modal-header">' +
            '    <h3 class="modal-title">{{ctrl.title}}</h3> ' +
            '  </div> ' +
            '  <div class="modal-body"> ' +
            '      <h4>{{ctrl.message}}</h4> ' +
            '  </div> ' +
            '  <div class="modal-footer"> ' +
            '      <div class="float-right"> ' +
            '          <button class="btn" ng-if="ctrl.showCancelButton" ng-click="ctrl.onCancel()">' +
            '               {{ctrl.cancelButtonLabel}} ' +
            '          </button> ' +
            '         <button class="btn btn-default" ng-click="ctrl.onOk()">{{ctrl.okButtonLabel}}</button ' +
            '     </div> ' +
            ' </div>';

        return {
            showConfirm: function (title, message, opts) {
                opts = opts || {};

                var modalOptions = {
                    animation: true,
                    controller: 'ConfirmController',
                    controllerAs: 'ctrl',
                    templateUrl: opts.templateUrl,
                    template: opts.template || template,
                    resolve: {
                        title: function () {
                            return title;
                        },
                        message: function () {
                            return message;
                        },
                        okButtonLabel: function () {
                            return opts.okLabel || 'OK';
                        },
                        cancelButtonLabel: function () {
                            return opts.cancelLabel || 'Cancel';
                        },
                        showCancelButton: function () {
                            return opts.hasOwnProperty('showCancel') ? opts.showCancel : true;
                        }
                    }
                };

                var modalInstance = $uibModal.open(modalOptions);

                return modalInstance.result;
            }
        };
    });