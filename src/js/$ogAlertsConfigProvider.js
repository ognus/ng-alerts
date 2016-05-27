angular.module('ogAlerts')

/**
 * $ogAlertsConfig provider allows to configure ogAlerts with following options:
 *   allowDuplicates - (default: false)
 */
.provider('$ogAlertsConfig', function (OG_DEFAULT_ALERTS_TYPES) {
  var options = this.options = {
    allowDuplicates: false,
    template: null,
    templateUrl: 'alerts.html',
    timeout: 6000,
    limit: MAX_INT,
    alertTypes: [
      { name: OG_DEFAULT_ALERTS_TYPES.INFO, classes: ['alert-info'] },
      { name: OG_DEFAULT_ALERTS_TYPES.SUCCESS, classes: ['alert-success'] },
      { name: OG_DEFAULT_ALERTS_TYPES.WARN, classes: ['alert-warning'] },
      { name: OG_DEFAULT_ALERTS_TYPES.ERROR, classes: ['alert-danger'] },
    ],
  };

  this.$get = function () {
    return {
      options: options,
    };
  };
});