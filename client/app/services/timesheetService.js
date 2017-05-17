'use strict';

angular.module('app')
  .factory('timesheetService', function ($http) {
    return {
      getTimesheets: function () {
        return $http.get('api/timesheets');
      },
      putTimesheet: function (timesheet) {
        return $http.put('api/timesheets/' + timesheet._id, timesheet);
      },
      postTimesheet: function (timesheet) {
        return $http.post('api/timesheets', timesheet);
      },
      deleteTimesheet: function (id) {
        return $http.delete('api/timesheets/' + id);
      }
    };
  });