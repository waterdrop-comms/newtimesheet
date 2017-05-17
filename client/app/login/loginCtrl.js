'use strict';

angular.module('app')
  .controller('loginCtrl',['$scope', '$location', 'authService', '$rootScope', function ($scope, $location, authService, $rootScope) {
    $scope.credentials = {'key':'value'};
    $scope.login = function () {
      authService.login($scope.credentials)
        .then(function () {
//            alert("login success ... move to root");
//            $scope.$apply(function(){ 
               $location.path('/');
                //if (!$rootScope.$$phase) 
                //$rootScope.$apply();
//            }); 
        })
        .catch(function (error, status) {
          console.error('login failed', error);
          alert("login failed. ...");
          $scope.errorMessage = status === 401 ? 'Invalid username or password' : error;
        });
    };
  }]);
