angular.module('ogAlerts')

/**
 * og-alerts directive
 */
.directive('ogAlerts', function ($ogAlertsConfig) {
  var directiveDefinition = {
    restrict: 'AE',
    scope: {
      limit: '=?ogLimit',
      timeout: '=?ogTimeout',
      allowDuplicates: '=?ogAllowDuplicates',
    },
    controller: '$ogAlertsController',
    controllerAs: 'vm',
  };

  var options = $ogAlertsConfig.options;

  // use template string if defined
  if (options.template) {
    directiveDefinition.template = options.template;
  } else {
    directiveDefinition.templateUrl = function (element, attrs) {
      return attrs.ogTemplateUrl || options.templateUrl;
    };
  }

  return directiveDefinition;
});