'use strict';

angular.module('app')
  .controller('headerCtrl', function ($scope, $location, authService) {
    $scope.$watch(authService.isAuthenticated, function (isAuthenticated) {
         $scope.isAuthenticated = isAuthenticated;
    });

    $scope.logout = function () {
         authService.logout();
         $location.path('/login');
    };
    var username = authService.getClaims().username;
    console.log(username);
       $scope.username = authService.getClaims().username;
  });
