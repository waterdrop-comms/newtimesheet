'use strict';

angular.module('app')
  .controller('registerCtrl', function ($scope, $location, authService) {
    $scope.credentials = {};
    $scope.register = function () {
      var resp = authService.register($scope.credentials, $scope, $location)
        .then(function () {
            alert("registedd....");
            $location.path('/');
        })
        .catch(function (error) {
          console.error('register failed', error);
          $scope.errorMessage = error;
        });
    };
  });
