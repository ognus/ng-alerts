/**
 * $ogAlertsConfig service tests
 */
describe('$ogAlertsConfig', function () {
  var $ogAlertsConfig;

  // load the ogAlerts module
  beforeEach(angular.mock.module('ogAlerts', function ($ogAlertsConfigProvider) {
    $ogAlertsConfigProvider.options.allowDuplicates = true;
    $ogAlertsConfigProvider.options.templateUrl = 'test.html';
    $ogAlertsConfigProvider.options.timeout = 2500;
    $ogAlertsConfigProvider.options.limit = 10;

    $ogAlertsConfigProvider.options.alertTypes.push({
      name: 'test',
      classes: ['alert-test'],
    });
  }));

  // inject services
  beforeEach(inject(function (_$ogAlertsConfig_) {
    $ogAlertsConfig = _$ogAlertsConfig_;
  }));

  it('should be defined', function () {
    expect($ogAlertsConfig).toBeDefined();
  });

  it('should have options set', function () {
    var options = $ogAlertsConfig.options;

    expect(options.allowDuplicates).toEqual(true);
    expect(options.templateUrl).toEqual('test.html');
    expect(options.timeout).toEqual(2500);
    expect(options.limit).toEqual(10);

    expect(options.alertTypes).toEqual([
      { name: 'info', classes: ['alert-info'] },
      { name: 'success', classes: ['alert-success'] },
      { name: 'warn', classes: ['alert-warning'] },
      { name: 'error', classes: ['alert-danger'] },
      { name: 'test', classes: ['alert-test'] },
    ]);
  });
});