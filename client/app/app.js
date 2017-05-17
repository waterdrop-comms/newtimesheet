'use strict';

angular.module('app', [
    'ui.router',
    'templates',
    'toasty'
  ])
  .config(function ($stateProvider, $urlRouterProvider) {
    $stateProvider
      .state('root', {
        abstract: true,
        views: {
          "header": {
            templateUrl: 'layout/header.tpl.html',
            controller: 'headerCtrl'
          },
          "footer": {
            templateUrl: 'layout/footer.tpl.html',
            controller: 'footerCtrl'
          }
        }
      });

    $stateProvider
      .state('root.login', {
        url: '/login',
        views: {
          "content@": {
            templateUrl: 'login/login.tpl.html',
            controller: 'loginCtrl'
          }
        }
      });

    $stateProvider
      .state('root.register', {
        url: '/register',
        views: {
          "content@": {
            templateUrl: 'register/register.tpl.html',
            controller: 'registerCtrl'
          }
        }
      });

    $stateProvider
      .state('root.timesheet', {
        url: '/',
        views: {
          "content@": {
            templateUrl: 'timesheet/timesheet.tpl.html',
            controller: 'timesheetCtrl'
          }
        }
      });

    $stateProvider
      .state('root.project', {
        url: '/projects',
        views: {
          "content@": {
            templateUrl: 'project/project.tpl.html',
            controller: 'projectCtrl'
          }
        }
      });

    $stateProvider
      .state('root.employee', {
        url: '/employees',
        views: {
          "content@": {
            templateUrl: 'employee/employee.tpl.html',
            controller: 'employeeCtrl'
          }
        }
      });

    $urlRouterProvider.otherwise('/');
  })
  .config(['$httpProvider', function ($httpProvider) {
       $httpProvider.interceptors.push('authInterceptor');
  }])
  .run(function ($document, $rootScope) {
    function resizeMain() {
      var navHeight = $('body > header > nav').height();
      var navMargin = 20;
      var footerHeight = $('body > footer').height();
      var footerMargin = 100;
      var h = $(window).height();
      $('main').css("min-height", h - navHeight - navMargin - footerHeight - footerMargin);
    }

    function fixNavbarCollapse() {
      $('.navbar-collapse a:not(.dropdown-toggle)').click(function () {
        $(this).parents('.navbar-collapse').collapse('hide');
      });
    }

    $document.ready(function () {
         $(window).resize(resizeMain);
         resizeMain();
         fixNavbarCollapse();
         $('footer').show();
    });

    $rootScope.$on('$viewContentLoaded', function () {
        resizeMain();
    });
  });
