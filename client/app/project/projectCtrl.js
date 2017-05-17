'use strict';

angular.module('app')
  .controller('projectCtrl', function ($scope, authService, projectService, toastService) {
    if (!authService.requireAuthentication()) {
      return;
    }

    $scope.editingProject = null;
    $scope.originalProject = null;

    $scope.title = authService.getClaims().username + '\'s Projects';

    function beginEdit(project) {
      $scope.editingProject = project;
      $scope.originalProject = JSON.parse(JSON.stringify(project));
    }

    function endEdit() {
      $scope.editingProject = null;
      $scope.originalProject = null;
    }

    function validateRequiredName(project) {
      if (!project.name || project.name === '' || project.name.trim() === '') {
        toastService.displayWarning('Project name is required');
        return false;
      }
      return true;
    }

    projectService.getProjects()
      .then(function (response) {
        var data = response.data;
        data.forEach(function (d) {
          d.sortableName = d.name;
        });
        $scope.projects = data;
      })
      .catch(function (error) {
        $scope.projects = [];
        toastService.displayError('Error Loading Projects', error);
      });

    $scope.edit = beginEdit;

    $scope.save = function () {
      console.log('Saving');
      var project = $scope.editingProject;
      if (!validateRequiredName(project)) return;
      project.isSaving = true;
      if (project._id) {
        projectService.putProject(project)
          .then(function (response) {
            var data = response.data;
            project.sortableName = data.name;
            project.name = data.name;
            project.isSaving = false;
          })
          .catch(function (error) {
            toastService.displayError('Error Saving Project', error);
            project.isSaving = false;
          });
      }
      else {
        projectService.postProject(project)
          .then(function (response) {
            var data = response.data;
            project._id = data._id;
            project.sortableName = data.name;
            project.name = data.name;
            project.isSaving = false;
          })
          .catch(function (error) {
            toastService.displayError('Error Saving Project', error);
            project.isSaving = false;
          });
      }
      endEdit();
    };

    $scope.cancel = function () {
      if (!$scope.editingProject) return;
      var index = $scope.projects.indexOf($scope.editingProject);
      if ($scope.editingProject._id) {
        // Cancelled editing existing project... Restore the original project
        $scope.projects[index] = $scope.originalProject;
      }
      else {
        // Cancelled adding new project... Remove the new project
        $scope.projects.splice(index, 1);
      }
      endEdit();
    };

    $scope.delete = function () {
      var project = $scope.editingProject;
      project.isSaving = true;
      var index = $scope.projects.indexOf(project);
      if (project._id) {
        projectService.deleteProject(project._id)
          .then(function () {
            project.isSaving = false;
            $scope.projects.splice(index, 1);
          })
          .catch(function (error) {
            toastService.displayError('Error Deleting Project', error);
            project.isSaving = false;
          });
      }
      endEdit();
    };

    $scope.add = function () {
      var project = {};
      $scope.projects.push(project);
      beginEdit(project);
    };

    $scope.canAdd = function () {
      return !$scope.isEditing()
        && !$scope.isLoading();
    };

    $scope.isEditing = function (project) {
      if (project) {
        return project === $scope.editingProject;
      }
      else {
        return $scope.editingProject !== null;
      }
    };

    $scope.isLoading = function () {
      return !$scope.projects
        || !$scope.projects;
    };

    $scope.isSaving = function () {
      return $scope.projects
        && $scope.projects.some(function (project) {
          return project.isSaving;
        });
    };
  });
