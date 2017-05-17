'use strict';

angular.module('app')
  .controller('footerCtrl', function ($scope, commonHelperService) {
    $scope.yearnow = commonHelperService.getYear();
  });
