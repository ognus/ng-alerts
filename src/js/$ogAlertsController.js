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