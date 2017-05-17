'use strict';

angular.module('app')
  .directive('ngDatepicker', function () {
    return {
      require: 'ngModel',
      link: function (scope, element, attrs, ngModel) {
        $(element).datepicker({
          onSelect: function (dateText) {
            scope.$apply(function () {
              ngModel.$setViewValue(dateText);
            });
          },
          beforeShowDay: function (date) {
            return [date.getDay() === 6]; // Only allow Saturdays to be selected
          },
          dateFormat: 'm/d/yy'
        });
      }
    };
  });
