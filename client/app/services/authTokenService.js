'use strict';

angular.module('app')
  .factory('authTokenService', function ($window) {
    function setToken(token) {
      if (token) {
        //alert('set token');
        $window.sessionStorage.authToken = token;
      }
      else {
       // alert('delete toke');
        delete $window.sessionStorage.authToken;
      }
    }

    function clearToken() {
      //alert('clearToken');
      setToken();
    }

    function getToken() {
      return $window.sessionStorage.authToken;
    }

    return {
      setToken: setToken,
      clearToken: clearToken,
      getToken: getToken
    };
  });

/*
There is a $cookies service available in the AngularJS API using the  ngCookies module. It can be used like below:
function controller($cookies) {
    //set cookie
    $cookies.put('token', 'myBearerToken');

    //get cookie
    var token=$cookies.get('token');

    //remove token
    $cookies.remove('token');
}
controller.$inject=['$cookies'];
For your case it would be:

//inject $cookies into controller
$scope.GetAuthorizeData = function () {
    $http({
        method: 'GET',
        url: "/api/Values",
        headers: { 'authorization': 'bearer <myTokenId>' },
    })
    .success(function (data) {
        $cookies.put('token', data);
    }).error(function () {
        alert("Failed :(");
    });
};

*/
