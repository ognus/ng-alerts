/**
 * AngularJS module for displaying alert notifications.
 * @version v0.0.1
 * @license MIT
 */

(function (global, factory) {
  if (typeof module === 'object' && module.exports) {
    // CommonJS
    if (typeof angular === 'undefined') {
      factory(require('angular'));
    } else {
      factory(angular);
    }
  } else if (typeof define === 'function' && define.amd) {
    // AMD
    define(['angular'], factory);
  } else {
    // Global Variables
    factory(global.angular);
  }
})(this, function (angular) {
  /**
 *  ogAlerts Module definition
 */
angular.module('ogAlerts', ['og-alerts.templates']);

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
angular.module('ogAlerts')

/**
 * $ogAlertsController controller is responsible for managing alerts UI.
 */
.controller('$ogAlertsController', function ($scope, $rootScope, $timeout, $ogAlertsConfig, OG_ALERTS_EVENTS) {
  var ctrl = this;

  // map of messages for duplicate checking purpose
  var queuedMessages = {};

  // queue of alerts waiting to be displayed, see limit option
  var alertsQueue = [];

  // map of alerts ids pointing to indexes in diplayed alerts list
  // for simple optimisation purposes, so we don't need to search alerts list
  // every time we want to remove / close an alert
  var displayedAlerts = {};


  function canQueueAlert(alert) {
    var duplicatesAllowed = ctrl.options.allowDuplicates;
    var notQueuedYet = !queuedMessages[alert.message];

    // only allow alerts that are not queued already or message duplicates are allowed 
    return duplicatesAllowed || notQueuedYet;
  }

  function getCSSClasses(alert) {
    // get alert type definition
    var typeDefinition = ctrl.options.alertTypes.filter(function (type) {
      return type.name === alert.type;
    })[0] || {};

    var classes = typeDefinition.classes || [];

    return classes.concat(alert.$$data.options.classes || []);
  }

  function queueAlert(alert) {
    if (canQueueAlert(alert)) {
      // add alert to the queue
      alertsQueue.push(alert);

      // add CSS classes
      alert.classes = getCSSClasses(alert);

      // mark message as displayed for duplicate checking purpose
      queuedMessages[alert.message] = true;
    }
  }

  function closeOnTimeout(alert) {
    // timeout from alert options take precedence
    // on timeout from config provider and directive argument
    var timeout = alert.$$data.options.timeout;
    timeout = timeout === undefined ? ctrl.options.timeout : timeout;

    // do not close alert on falsy timeout values
    if(timeout) {
      ctrl.close(alert.id, timeout);
    }
  }

  function removeAlert(alertId) {
    var alertIndex = displayedAlerts[alertId];

    // don't do anything if alert was already removed
    if(alertIndex || alertIndex === 0) {
      // remove alert from the displayed alerts list based on index fetched from the map
      var removedAlert = ctrl.alerts.splice(alertIndex, 1)[0];

      // delete message displayed mark
      delete queuedMessages[removedAlert.message];

      // clear index from displayed alerts map
      delete displayedAlerts[alertId];

      // display any remaining alert in the queue
      attemptToDisplayAlert();
    }
  }

  function displayAlert(alert) {
    // index of an alert newly added to the displayed alerts list
    var alertIndex = ctrl.alerts.length;

    // add alert to the displayed alerts list 
    ctrl.alerts.push(alert);

    // add alert id and index to displayed alerts map
    displayedAlerts[alert.id] = alertIndex;
  }

  function attemptToDisplayAlert() {
    // only add new alert if number of displayed alerts hasn't reached the limit
    if (ctrl.alerts.length < ctrl.options.limit) {
      // get the first alert from the queue
      var alertToDisplay = alertsQueue.shift();

      // display, if there was infact an alert in the queue
      if (alertToDisplay) {
        // initiate closing timeout
        closeOnTimeout(alertToDisplay);

        // display alert by adding it to the alerts list
        displayAlert(alertToDisplay)
      }
    }
  }

  function getOptionValue(optionName) {
    var directiveOption = $scope[optionName];

    // use default from $ogAlertsConfig provider
    if (directiveOption === undefined) {
      return $ogAlertsConfig.options[optionName];
    }

    return directiveOption;
  }

  function getOptions() {
    var options = {};

    Object.keys($ogAlertsConfig.options).forEach(function (optionName) {
      options[optionName] = getOptionValue(optionName);
    });

    return options;
  }

  /*
   * Public controller API
   */
  ctrl.options = getOptions();

  // displayed alerts list
  ctrl.alerts = [];

  /**
   * Closes alert.
   * 
   * @param {Integer} alertId   - alert id
   * @param {Integer} timeoutMs - timeout in milliseconds, optional
   */
  ctrl.close = function (alertId, timeoutMs) {
    // this function can be called multiple times for same alertId,
    // as a result of user click, default timeout or event from the $ogAlerts service
    // however we don't need to clear existing timeouts, as alert removal function will
    // execute correctly even if alert doesn't exist anymore.
    $timeout(function () {
      // delete alert instance
      removeAlert(alertId);
    }, timeoutMs || 0);
  };

  // listen for alert open event
  $rootScope.$on(OG_ALERTS_EVENTS.$$OPEN_EVENT, function (event, alert) {
    queueAlert(alert);
    attemptToDisplayAlert();
  });

  // listen for alert close event
  $rootScope.$on(OG_ALERTS_EVENTS.$$CLOSE_EVENT, function (event, alertId) {
    // close alert
    ctrl.close(alertId);
  });
});
angular.module("og-alerts.templates", []).run(["$templateCache", function($templateCache) {$templateCache.put("alerts.html","<div ng-repeat=\"alert in vm.alerts\"><div class=\"alert alert-warning alert-dismissible\" ng-class=\"alert.classes\" role=\"alert\"><button type=\"button\" class=\"close\" ng-click=\"vm.close(alert.id)\"><span>&times;</span></button><div ng-bind=\"alert.message\"></div></div></div>");}]);
/**
 *  Some useful constants
 */
var MAX_INT = Math.pow(2, 53) - 1;
var TRANSLATE_SERVICE_NAME = '$translate';


angular.module('ogAlerts')

/**
 * $ogAlerts service is responsible for defining alerts API.
 * You can use it in other services, controllers and directives
 * to display a message to the user.
 */
.service('$ogAlerts', function ($q, $log, $rootScope, $timeout, $injector, OG_ALERTS_EVENTS, OG_DEFAULT_ALERTS_TYPES) {
  var currentId = 0;

  /**
   * Each invokation returns next value of sequentional id,
   * starting from value 1.
   * 
   * @return {Integer} generated id
   */
  function generateId() {
    if (currentId >= MAX_INT) {
      currentId = 0;
    }

    // increase sequentional id and return it
    return ++currentId;
  }

  /**
   * Returns $translate service if it exists.
   * 
   * @return {Function} $translate service or a stub that just returns passed msg argument
   */
  function getTranslateService() {
    // inject $translate service if it exists
    if ($injector.has(TRANSLATE_SERVICE_NAME)) {
      return $injector.get(TRANSLATE_SERVICE_NAME);
    }

    // return fake (stub) translate service
    return function (message) {
      return $q.resolve(message);
    }
  }

  /**
   * Shows an alert by emiting alert data event on $rootScope that og-alerts
   * directive is listening on.
   * 
   * @param  {String}   type              - alert type
   * @param  {String}   message           - message
   * @param  {Object}   translationParams - translation params
   * @param  {Object}   options           - alert display options:
   *         {Array}    classes           - additional classes added to alert DOM element when displayed
   *         {Number}   timeout
   * 
   * @return {Object}                     alert API:
   *         {Number}   id                - alert id
   *         {Function} close             - alert close() function
   */
  function showAlert(type, message, translationParams, options) {
    var alertId = generateId();

    // deferreds to allow listening on alert life cycle
    var onCloseDeferred = $q.defer();
    var onQueueDeferred = $q.defer();
    var onDisplayDeferred = $q.defer();

    // translate message
    var translatePromise = $translate(message, translationParams)
      .then(function (translatedMessage) {
        // create alert instance
        var alert = {
          id: alertId,
          type: type,
          message: translatedMessage,
          $$data: {
            options: options || {},
            deferreds: {
              onClose: onCloseDeferred,
              onQueue: onQueueDeferred,
              onDisplay: onDisplayDeferred,
            }
          }
        };

        // emit event to show the alert message
        $rootScope.$emit(OG_ALERTS_EVENTS.$$OPEN_EVENT, alert);
      })
      .catch(function (err) {
        $log.error('Failed to translate message: ' + message, err);
      });

    /**
     * alert message instance API
     */
    return {
      /**
       * Alert unique sequentional ID.
       * 
       * @type {Number}
       */
      id: alertId,
      /**
       * onClosePromise resolves when alert is closed,
       * either by alert instance API, default timeout or user action.
       * This promise never rejects.
       * 
       * @type {Promise}
       */
      onClosePromise: onCloseDeferred.promise,
      /**
       * onQueuePromise resolves when alert is added to display queue, 
       * @type {[type]}
       */
      onQueuePromise: onQueueDeferred.promise,
      /**
       * [onDisplayPromise description]
       * @type {[type]}
       */
      onDisplayPromise: onDisplayDeferred.promise,
      /**
       * Closes the alert.
       */
      close: function () {
        // wait for alert to be actually created first, before it can be closed
        translatePromise.then(function () {
          $rootScope.$emit(OG_ALERTS_EVENTS.$$CLOSE_EVENT, alertId);
        });
      },
    };
  }

  // get $translate service
  var $translate = getTranslateService();

  /**
   * Alert service API
   */
  return {
    show: function (type, message, translationParams, options) {
      return showAlert(type, message, translationParams, options);
    },
    error: function (message, translationParams, options) {
      return showAlert(OG_DEFAULT_ALERTS_TYPES.ERROR, message, translationParams, options);
    },
    warn: function (message, translationParams, options) {
      return showAlert(OG_DEFAULT_ALERTS_TYPES.WARN, message, translationParams, options);
    },
    info: function (message, translationParams, options) {
      return showAlert(OG_DEFAULT_ALERTS_TYPES.INFO, message, translationParams, options);
    },
    success: function (message, translationParams, options) {
      return showAlert(OG_DEFAULT_ALERTS_TYPES.SUCCESS, message, translationParams, options);
    },
    closeAll: function () {
      $rootScope.$emit(OG_ALERTS_EVENTS.$$CLOSE_EVENT);
    },
  };
});
/**
 * ogAlert angular constants
 */
angular.module('ogAlerts')

.constant('OG_ALERTS_EVENTS', {
  $$OPEN_EVENT: 'og-alerts:$$event:open',
  $$CLOSE_EVENT: 'og-alerts:$$event:close',
})

.constant('OG_DEFAULT_ALERTS_TYPES', {
  ERROR: 'error',
  WARN: 'warn',
  INFO: 'info',
  SUCCESS: 'success',
});
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
});

