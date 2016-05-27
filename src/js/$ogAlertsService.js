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