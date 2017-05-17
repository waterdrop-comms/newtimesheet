'use strict';

angular.module('app')
  .controller('employeeCtrl', function ($scope, authService, employeeService, toastService) {
    if (!authService.requireAuthentication()) {
         return;
    }

    $scope.editingEmployee = null;
    $scope.originalEmployee = null;

    $scope.title = 'Employee List';

    function beginEdit(employee) {
        $scope.editingEmployee = employee;
        $scope.originalEmployee = JSON.parse(JSON.stringify(employee));
    }

    function endEdit() {
        $scope.editingEmployee = null;
        $scope.originalEmployee = null;
    }

    function validateRequiredName(employee) {
      if (!employee.name || employee.name === '' || employee.name.trim() === '') {
           toastService.displayWarning('Employee name is required');
           return false;
      }
      return true;
    }

    employeeService.getEmployees()
      .then(function (response) {
            var data = response.data;
            data.forEach(function (d) {
                d.sortableName = d.employeelastname;
            });
            $scope.employees = data;
      })
      .catch(function (error) {
            $scope.employees = [];
            toastService.displayError('Error Loading Employees', error);
      });

    $scope.edit = beginEdit;

    $scope.save = function () {
      console.log('Saving');
      var employee = $scope.editingEmployee;
      if (!validateRequiredName(employee)) return;
      employee.isSaving = true;
      if (employee._id) {
        employeeService.putEmployee(employee)
          .then(function (response) {
            var data = response.data;
            employee.sortableName = data.name;
            employee.name = data.name;
            employee.isSaving = false;
          })
          .catch(function (error) {
            toastService.displayError('Error Saving employee', error);
            employee.isSaving = false;
          });
      }
      else {
        employeeService.postEmployee(employee)
          .then(function (response) {
            var data = response.data;
            employee._id = data._id;
            employee.sortableName = data.name;
            employee.name = data.name;
            employee.isSaving = false;
          })
          .catch(function (error) {
            toastService.displayError('Error Saving employee', error);
            employee.isSaving = false;
          });
      }
      endEdit();
    };

    $scope.cancel = function () {
        if (!$scope.editingEmployee) return;
        var index = $scope.employees.indexOf($scope.editingEmployee);
        if ($scope.editingEmployee._id) {
          // Cancelled editing existing employee... Restore the original employee
          $scope.employees[index] = $scope.originalEmployee;
        }
        else {
          // Cancelled adding new employee... Remove the new employee
          $scope.employees.splice(index, 1);
        }
        endEdit();
    };

    $scope.delete = function () {
        var employee = $scope.editingEmployee;
        employee.isSaving = true;
        var index = $scope.employees.indexOf(employee);
        if (employee._id) {
          employeeService.deleteEmployee(employee._id)
            .then(function () {
              employee.isSaving = false;
              $scope.employees.splice(index, 1);
            })
            .catch(function (error) {
              toastService.displayError('Error Deleting employee', error);
              employee.isSaving = false;
            });
        }
        endEdit();
    };

    $scope.add = function () {
        var employee = {};
        $scope.employees.push(employee);
        beginEdit(employee);
    };

    $scope.canAdd = function () {
        return !$scope.isEditing()
          && !$scope.isLoading();
    };

    $scope.isEditing = function (employee) {
        if (employee) {
          return employee === $scope.editingEmployee;
        }
        else {
          return $scope.editingEmployee !== null;
        }
    };

    $scope.isLoading = function () {
        return !$scope.employees
          || !$scope.employees;
    };

    $scope.isSaving = function () {
        return $scope.employees
          && $scope.employees.some(function (employee) {
            return employee.isSaving;
          });
    };
  });
