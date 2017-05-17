'use strict';

angular.module('app')
  .factory('toastService', function (toasty) {
    function displayError(title, data) {
      toasty.pop.error({
        title: title,
        msg: data,
        showClose: true,
        clickToClose: true,
        timeout: 0
      });
      console.error(data ? title + ': ' + data : title);
    }

    function displayWarning(title, data) {
      toasty.pop.warning({
        title: title,
        msg: data,
        showClose: true,
        clickToClose: true,
        timeout: 5000
      });
      console.warn(data ? title + ': ' + data : title);
    }

    return {
      displayError: displayError,
      displayWarning: displayWarning
    };
  });

