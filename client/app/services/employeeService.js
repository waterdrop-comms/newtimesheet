'use strict';

angular.module('app')
  .factory('employeeService', function ($http) {
    return {
      getEmployees: function () {
        return $http.get('api/employees');
      }  ,
      putEmployee: function (employee) {
        return $http.put('api/employees/' + employee._id, employee);
      },
      postEmployee: function (employee) {
        return $http.post('api/employees', employee);
      },
      deleteEmployee: function (id) {
        return $http.delete('api/employees/' + id);
      } 
    };
  });
