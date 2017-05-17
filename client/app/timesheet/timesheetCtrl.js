'use strict';

angular.module('app')
  .controller('timesheetCtrl', function ($scope, authService, projectService, timesheetService, toastService) {
    if (!authService.requireAuthentication()) {
      return;
    }

    var editingTimesheet = null;
    var originalTimesheet = null;

    $scope.title = authService.getClaims().username + '\'s Timesheets';

    // Parses a date string of the format yyyy-mm-dd
    function getDateString(d) {
      var parts = d.match(/(\d+)/g);
      return parseInt(parts[1]) + '/' + parseInt(parts[2]) + '/' + parts[0];
    }

    function beginEdit(timesheet) {
      editingTimesheet = timesheet;
      originalTimesheet = JSON.parse(JSON.stringify(timesheet));
    }

    function endEdit() {
      editingTimesheet = null;
      originalTimesheet = null;
    }

    function validateRequiredWeekEnding(timesheet) {
      if (!timesheet.weekEnding || timesheet.weekEnding === '' || timesheet.weekEnding.trim() === '') {
        toastService.displayWarning('Week ending date is required');
        return false;
      }
      return true;
    }

    projectService.getProjects()
      .then(function (response) {
        var data = response.data;
        $scope.projects = data;
      })
      .catch(function (error) {
        $scope.projects = [];
        toastService.displayError('Error Loading Projects', error.data);
      });

    timesheetService.getTimesheets()
      .then(function (response) {
        var data = response.data; 
        data.forEach(function (d) {
          d.sortableWeekEnding = d.weekEnding;
          d.weekEnding = getDateString(d.weekEnding);
        });
        $scope.timesheets = data;
      })
      .catch(function (error) {
        $scope.timesheets = [];
        toastService.displayError('Error Loading Timesheets', error.data);
      });

    $scope.calcTotalHoursByDay = function (timesheet, day) {
      if (!timesheet.projects) return 0;
      return timesheet.projects
        .map(function (x) {
          return x.hours[day];
        })
        .reduce(function (a, b) {
          return a + b;
        });
    };

    $scope.calcTotalHoursByProject = function (project) {
      if (!project) return 0;
      var totalHours = 0;
      for (var day = 0; day < 7; day++) {
        totalHours += project.hours[day];
      }
      return totalHours;
    };

    $scope.calcTotalHours = function (timesheet) {
      var totalHours = 0;
      for (var day = 0; day < 7; day++) {
        totalHours += $scope.calcTotalHoursByDay(timesheet, day);
      }
      return totalHours;
    };

    $scope.edit = beginEdit;

    $scope.save = function () {
      console.log('Saving');
      var timesheet = editingTimesheet;
      if (!validateRequiredWeekEnding(timesheet)) return;
      timesheet.isSaving = true;
      if (timesheet._id) {
        timesheetService.putTimesheet(timesheet)
          .then(function (response) {
            var data = response.data;
            timesheet.sortableWeekEnding = data.weekEnding;
            timesheet.weekEnding = getDateString(data.weekEnding);
            timesheet.projects = data.projects;
            timesheet.isSaving = false;
          })
          .catch(function (error) {
            toastService.displayError('Error Saving Timesheet', error);
            timesheet.isSaving = false;
          });
      }
      else {
        timesheetService.postTimesheet(timesheet)
          .then(function (response) {
            var data = response.data;
            timesheet._id = data._id;
            timesheet.sortableWeekEnding = data.weekEnding;
            timesheet.weekEnding = getDateString(data.weekEnding);
            timesheet.projects = data.projects;
            timesheet.isSaving = false;
          })
          .catch(function (error) {
            toastService.displayError('Error Saving Timesheet', error.data);
            timesheet.isSaving = false;
          });
      }
      endEdit();
    };

    $scope.cancel = function () {
      if (!editingTimesheet) return;
      var index = $scope.timesheets.indexOf(editingTimesheet);
      if (editingTimesheet._id) {
        // Cancelled editing existing timesheet... Restore the original timesheet
        $scope.timesheets[index] = originalTimesheet;
      }
      else {
        // Cancelled adding new timesheet... Remove the new timesheet
        $scope.timesheets.splice(index, 1);
      }
      endEdit();
    };

    $scope.delete = function () {
      var timesheet = editingTimesheet;
      timesheet.isSaving = true;
      var index = $scope.timesheets.indexOf(timesheet);
      if (timesheet._id) {
        timesheetService.deleteTimesheet(timesheet._id)
          .then(function () {
            timesheet.isSaving = false;
            $scope.timesheets.splice(index, 1);
          })
          .catch(function (error) {
            toastService.displayError('Error Deleting Timesheet', error.data);
            timesheet.isSaving = false;
          });
      }
      endEdit();
    };

    $scope.add = function () {
      var timesheet = {projects: [{hours: [0, 0, 0, 0, 0, 0, 0]}]};
      $scope.timesheets.push(timesheet);
      beginEdit(timesheet);
    };

    $scope.addProject = function () {
      var timesheet = editingTimesheet;
      timesheet.projects.push({hours: [0, 0, 0, 0, 0, 0, 0]});
    };

    $scope.deleteProject = function (project) {
      var timesheet = editingTimesheet;
      var index = timesheet.projects.indexOf(project);
      timesheet.projects.splice(index, 1);
    };

    $scope.canEdit = function (timesheet) {
      return !$scope.isEditing()
        && !$scope.isLoading()
        && !timesheet.isSaving;
    };

    $scope.canAdd = function () {
      return !$scope.isEditing()
        && !$scope.isLoading();
    };

    $scope.isEditing = function (timesheet) {
      if (timesheet) {
        return timesheet === editingTimesheet;
      }
      else {
        return editingTimesheet !== null;
      }
    };

    $scope.isLoading = function () {
      return !$scope.projects
        || !$scope.timesheets;
    };

    $scope.isSaving = function () {
      return $scope.timesheets
        && $scope.timesheets.some(function (timesheet) {
          return timesheet.isSaving;
        });
    };

  });
