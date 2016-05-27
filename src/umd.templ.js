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
  <%= contents %>
});

