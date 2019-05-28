angular.module('portal.pages.manage-users')
    .component('userList', {
        templateUrl: 'app/pages/manage-users/user-list/user-list.template.html',
        bindings: {
            onSelectionChanged: '&',
            api: '<'
        },
        controller: [
            '$scope', 'User', 'lodash', 'manageUserViewPrefs', '$location',
            function($scope, User, lodash, manageUserViewPrefs, $location) {
                'use strict';
                var ctrl = this;

                ctrl.$postLink = function() {
                    // function is injected by st-refresh directive
                    ctrl.tableRefresh = $scope.tableRefresh;
                    ctrl.initialSearchParams = $location.search();
                };

                ctrl.isRefreshing = false;
                ctrl.selectedUser = undefined;
                ctrl.itemsPerPage = manageUserViewPrefs.usersPerPage;

                ctrl.showUser = function (id) {
                    ctrl.pageToUser = id;
                    ctrl.tableRefresh();
                };

                ctrl.businessNames = function(user) {
                    var names = lodash(user.businesses).map(function (b) {
                        var name = b.businessName;
                        if (b.doesBusinessAs) {
                            name += ' (' + b.doesBusinessAs + ')';
                        }
                        return name;
                    });

                    return names.join(', ');
                };

                ctrl.onSelect = function (row, newValue) {
                    if (row === ctrl.selectedUser && !newValue) {
                        ctrl.selectedUser = undefined;
                    }
                    if (newValue) {
                        ctrl.selectedUser = row;
                    }
                    if (ctrl.onSelectionChanged) {
                        ctrl.onSelectionChanged({ user: ctrl.selectedUser });
                    }
                };

                ctrl.refreshUsers = function (tableState) {
                    if (ctrl.selectedUser) {
                        ctrl.selectedUser.isSelected = false;
                        ctrl.selectedUser = undefined;
                    }

                    if (ctrl.initialSearchParams) {
                        ctrl.pageToUser = ctrl.initialSearchParams.includingUser;

                        tableState.pagination = {
                            start: Number(ctrl.initialSearchParams.startIndex) || 0,
                            number: Number(ctrl.initialSearchParams.count) || manageUserViewPrefs.usersPerPage
                        };
                        tableState.search.predicateObject = {
                            Business: ctrl.initialSearchParams.Business,
                            UserName: ctrl.initialSearchParams.UserName
                        };
                        tableState.sort = {
                            predicate: ctrl.initialSearchParams.sortPredicate,
                            reverse: ctrl.initialSearchParams.sortDescending
                        };
                        ctrl.initialSearchParams = undefined;
                    }

                    var pagination = tableState.pagination;
                    var start = pagination.start || 0;
                    var number = pagination.number || manageUserViewPrefs.usersPerPage;

                    var sort = tableState.sort;
                    var sortPredicate = sort.predicate || 'userName';
                    var sortDescending = sort.reverse;

                    var search = tableState.search.predicateObject || {};
                    var queryParams = {
                        UserName: null,
                        Role: null,
                        Business: null,
                        startIndex: start,
                        count: number,
                        sortPredicate: sortPredicate,
                        includingUser: null,
                        sortDescending: sortDescending
                    };

                    if (ctrl.pageToUser) {
                        queryParams.includingUser = ctrl.pageToUser;
                        // Clear the search critera so the user will not be filtered out
                        for (var propToClear in search) {
                            if (search.hasOwnProperty(propToClear)) {
                                search[propToClear] = '';
                            }
                        }
                    } else {
                        queryParams.includingUser = '';
                        for (var searchProp in search) {
                            if (search.hasOwnProperty(searchProp)) {
                                queryParams[searchProp] = search[searchProp];
                            }
                        }
                    }

                    $location.search(queryParams);

                    ctrl.isRefreshing = true;
                    User.query(queryParams).$promise.then(function (data) {
                        ctrl.isRefreshing = false;
                        if (data.resource.userPage) {
                            tableState.pagination.start = data.resource.userPage * number;
                        }
                        tableState.pagination.number = manageUserViewPrefs.usersPerPage;
                        tableState.pagination.totalItemCount = data.resource.userCount;
                        tableState.pagination.numberOfPages = Math.ceil(data.resource.userCount / manageUserViewPrefs.usersPerPage);
                        ctrl.users = data.resource;

                        if (ctrl.pageToUser) {
                            ctrl.selectedUser = lodash(ctrl.users).find({ id: ctrl.pageToUser });
                            if (ctrl.selectedUser) {
                                ctrl.selectedUser.isSelected = true;
                            }
                            // Page-to-user is a one-time operation. 
                            ctrl.pageToUser = undefined;
                        }
                    }).finally(function () {
                        ctrl.isRefreshing = false;
                    });
                };

                // publish selected methods as API
                ctrl.api.showUser = ctrl.showUser;
            }
        ]
    });