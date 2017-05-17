'use strict';

angular.module('app')
  .factory('commonHelperService', function () {
    return {
      getYear: function () {
         var today = new Date();
         var year = today.getFullYear(); 
         return year;
      }
    };
  });
