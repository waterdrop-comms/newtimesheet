'use strict';

angular.module('app')
  .factory('authService', function ($http, $location, authTokenService) {
    var _claims;

    function getClaims() {
      var token = authTokenService.getToken();
      if (!token) {
        //alert('no token stored');
        return {};
      }
      _claims = _claims || jwt_decode(token);
      return _claims;
    }

    function clearClaims() {
      _claims = null;
    }

    function isAuthenticated() {
      return !!authTokenService.getToken();
    }

    function requireAuthentication() {
      if (!isAuthenticated()) {
        //alert('Authenticate is required, redirecting to login');
        console.log('Authenticate is required, redirecting to login');
        $location.path('/login');
        return false;
      }
      return true;
    }

    function login(credentials) {
      return $http.post('/api/auth/login', credentials)
        .then(function (response) {
             var data = response.data; 
//             alert("token data");
//             alert(data);
             authTokenService.setToken(data.token);
        })
        .catch(function () {
             alert("clear token");
             authTokenService.clearToken();
        }).finally(function(){
             //alert("login finally.");
        });
    }

    function logout() {
      authTokenService.clearToken();
      clearClaims();
    }

    function register(credentials, $scope, $location) {
      //alert("credentials");

      var config = {
                headers : {
                    'Content-Type': 'application/json;'
                }
            };


      var request = $.ajax({
                url: '/api/auth/user',
                type: "POST",
                data: JSON.stringify(credentials),
                contentType: 'application/json; charset=utf-8',
                dataType: "json",
                success: function(data) {
                     authTokenService.setToken(data.token);
                     //credentials.success(data);
                    //alert('success to set token, change path');
                    $scope.$apply(function(){ 
                        $location.path('/');
                    });   
                },
                error: function(jqXHR, textStatus, err) {
                   // alert( "Request failed: " + textStatus );
                    authTokenService.clearToken();
                    credentials.error(jqXHR, textStatus, err);
                }
            });


//            request.done
            request.fail(function(jqXHR, textStatus) {
                //alert( "Request failed: " + textStatus );
                authTokenService.clearToken();
            }); 


/* 2017-05-28 just out
         return $http.post(
              '/api/auth/user', 
              credentials
         )
        .success(function (data, status, headers, config) {
          console.log(data);
          alert("reg succss");
          authTokenService.setToken(data.token);
        })
        .error(function(data, status, headers, config) {
          alert("reg failed");
          console.log("error ");
          authTokenService.clearToken();
        });
*/

    }

    return {
      login: login,
      logout: logout,
      register: register,
      isAuthenticated: isAuthenticated,
      requireAuthentication: requireAuthentication,
      getClaims: getClaims
    };
  });
