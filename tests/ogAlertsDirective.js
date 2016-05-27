/**
 * og-alerts directive tests
 */
describe('ogAlertsDirective', function () {
  var element, vm, $ogAlerts, $scope, $timeout, $compile;

  // load the ogAlerts module
  beforeEach(angular.mock.module('ogAlerts'));

  // inject services
  beforeEach(inject(function($rootScope, _$compile_, _$timeout_, _$ogAlerts_) {
    $timeout = _$timeout_;
    $ogAlerts = _$ogAlerts_;
    $compile = _$compile_;

    $scope = $rootScope.$new();
  }));


  describe('with default template', function () {
    beforeEach(inject(function() {
      element = angular.element('<og-alerts og-limit="5" og-timeout="3000" og-allow-duplicates="true">');

      $compile(element)($scope);

      $scope.$digest();

      vm = element.isolateScope().vm;
    }));
  
    it('should be defined and initialize correctly', function () {
      expect(element).toBeDefined();

      // no alerts yet
      expect(element.children().length).toEqual(0);

      var isolateScope = element.isolateScope();
      
      expect(isolateScope.limit).toEqual(5);
      expect(isolateScope.timeout).toEqual(3000);
      expect(isolateScope.allowDuplicates).toEqual(true);
    });

    it('should display alert', function () {
      $ogAlerts.info('Test message', null, { classes: ['alert-test'] });

      $scope.$apply();

      var alerts = element.find('.alert');

      expect(alerts.length).toEqual(1);

      var alert = alerts.first();

      expect(alert.attr('class')).toEqual('alert alert-warning alert-dismissible alert-info alert-test');

      var message = alert.find('[ng-bind="alert.message"]').html();

      expect(message).toEqual('Test message');
    });

    it('should close alert', function () {
      $ogAlerts.info('Test message');

      $scope.$apply();

      var alerts = element.find('.alert');

      expect(alerts.length).toEqual(1);

      var closeButton = alerts.find('button.close');

      closeButton.click();

      $timeout.flush(0);

      alerts = element.find('.alert');

      expect(alerts.length).toEqual(0);
    });
  });

  describe('with custom template', function () {
    it('should allow to set custom template URL as directive attribute', function () {
      inject(function ($templateCache) {
        $templateCache.put('test.html', '<div class="test"></div>');
      });

      element = angular.element('<og-alerts og-template-url="test.html">');

      $compile(element)($scope);

      $scope.$digest();

      var testElement = element.find('.test');

      expect(testElement.length).toEqual(1);
    });

    it('should allow to set custom template URL as $ogAlertsConfig option', function () {
      inject(function ($templateCache, $ogAlertsConfig) {
        $templateCache.put('test.html', '<div class="test"></div>');

        $ogAlertsConfig.options.templateUrl = 'test.html';
      });

      element = angular.element('<og-alerts>');

      $compile(element)($scope);

      $scope.$digest();

      var testElement = element.find('.test');

      expect(testElement.length).toEqual(1);
    });

    it('should allow to set custom template string as $ogAlertsConfig option', function () {
      inject(function ($templateCache, $ogAlertsConfig) {
        $ogAlertsConfig.options.template = '<div class="test"></div>';
      });

      element = angular.element('<og-alerts>');

      $compile(element)($scope);

      $scope.$digest();

      var testElement = element.find('.test');

      expect(testElement.length).toEqual(1);
    });
  });
});