'use strict';

angular.module('app')
  .factory('authInterceptor', function ($rootScope, $q, authTokenService) {
    return {
      request: function (config) {
        config.headers = config.headers || {};
        var authToken = authTokenService.getToken();
        if (authToken) {
          config.headers.Authorization = 'JWT ' + authToken;
        }
        return config;
      },
      response: function (response) {
        return response || $q.when(response);
      }
    };
  });
