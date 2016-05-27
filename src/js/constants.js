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