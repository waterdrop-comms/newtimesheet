'use strict';

angular.module('app')
  .factory('projectService', function ($http) {
    return {
      getProjects: function () {
        return $http.get('api/projects');
      },
      putProject: function (project) {
        return $http.put('api/projects/' + project._id, project);
      },
      postProject: function (project) {
        return $http.post('api/projects', project);
      },
      deleteProject: function (id) {
        return $http.delete('api/projects/' + id);
      }
    };
  });