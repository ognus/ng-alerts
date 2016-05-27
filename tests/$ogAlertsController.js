/**
 * $ogAlertsController controller tests
 */
describe('$ogAlertsController', function () {
  var $ogAlertsController, $ogAlertsConfig, $scope, $rootScope, $controller, $timeout;

  function initializeController() {
    $ogAlertsController = $controller('$ogAlertsController', {
      $scope: $scope,
      $ogAlertsConfig: $ogAlertsConfig,
    });
  }

  // load the ogAlerts module
  beforeEach(angular.mock.module('ogAlerts'));

  // inject services
  beforeEach(inject(function (_$controller_, _$rootScope_, _$timeout_) {
    $controller = _$controller_;
    $rootScope = _$rootScope_;
    $timeout = _$timeout_;
    $scope = $rootScope.$new();

    // $ogAlertsConfig mock
    $ogAlertsConfig = {
      options: {
        limit: 2,
        timeout: false,
        allowDuplicates: false,
        alertTypes: [
          { name: 'error', classes: ['alert-error', 'alert-test'] },
        ],
      },
    };
  }));

  it('should be defined and initialize correctly', function () {
    initializeController();
    expect($ogAlertsController).toBeDefined();

    expect($ogAlertsController.options).toEqual({
      limit: 2,
      timeout: false,
      allowDuplicates: false,
      alertTypes: [
        { name: 'error', classes: ['alert-error', 'alert-test'] },
      ],
    });

    expect($ogAlertsController.alerts).toEqual([]);
  });

  it('should initialize options based on $scope', function () {
    $scope.limit = 3;
    $scope.timeout = 5000;

    initializeController();

    expect($ogAlertsController.options).toEqual({
      limit: 3,
      timeout: 5000,
      allowDuplicates: false,
      alertTypes: [
        { name: 'error', classes: ['alert-error', 'alert-test'] },
      ],
    });
  });

  it('should display alert', function () {
    initializeController();

    $rootScope.$emit('og-alerts:$$event:open', {
      id: 123,
      type: 'error',
      message: 'Test Message',
      $$data: {
        options: {},
      },
    });

    $rootScope.$apply();

    expect($ogAlertsController.alerts).toEqual([{
      id: 123,
      type: 'error',
      message: 'Test Message',
      $$data: {
        options: {},
      },
      classes: ['alert-error', 'alert-test'],
    }])
  });

  it('should display alert with custom CSS classes', function () {
    initializeController();

    $rootScope.$emit('og-alerts:$$event:open', {
      id: 123,
      type: 'error',
      message: 'Test Message',
      $$data: {
        options: {
          classes: ['alert-custom', 'alert-custom-test'],
        },
      },
    });

    $rootScope.$apply();

    expect($ogAlertsController.alerts).toEqual([{
      id: 123,
      type: 'error',
      message: 'Test Message',
      $$data: {
        options: {
          classes: ['alert-custom', 'alert-custom-test'],
        },
      },
      classes: ['alert-error', 'alert-test', 'alert-custom', 'alert-custom-test'],
    }])
  });

  it('should not display message duplicates', function () {
    initializeController();

    $rootScope.$emit('og-alerts:$$event:open', {
      id: 123,
      type: 'error',
      message: 'Test Message',
      $$data: {
        options: {},
      },
    });

    $rootScope.$apply();

    expect($ogAlertsController.alerts.length).toEqual(1);

    $rootScope.$emit('og-alerts:$$event:open', {
      id: 124,
      type: 'info',
      message: 'Test Message',
      $$data: {
        options: {},
      },
    });

    $rootScope.$apply();

    expect($ogAlertsController.alerts.length).toEqual(1);
  });

  it('should display message duplicates if allowed in the options', function () {
    $scope.allowDuplicates = true;

    initializeController();

    $rootScope.$emit('og-alerts:$$event:open', {
      id: 123,
      type: 'error',
      message: 'Test Message',
      $$data: {
        options: {},
      },
    });

    $rootScope.$apply();

    expect($ogAlertsController.alerts.length).toEqual(1);

    $rootScope.$emit('og-alerts:$$event:open', {
      id: 124,
      type: 'info',
      message: 'Test Message',
      $$data: {
        options: {},
      },
    });

    $rootScope.$apply();

    expect($ogAlertsController.alerts.length).toEqual(2);
  });

  describe('close()', function () {
    it('should remove alert', function () {
      initializeController();

      $rootScope.$emit('og-alerts:$$event:open', {
        id: 123,
        type: 'error',
        message: 'Test Message',
        $$data: {
          options: {},
        },
      });

      $rootScope.$emit('og-alerts:$$event:open', {
        id: 124,
        type: 'info',
        message: 'Test Message Info',
        $$data: {
          options: {},
        },
      });

      $rootScope.$apply();

      expect($ogAlertsController.alerts.length).toEqual(2);

      $ogAlertsController.close(123);

      $timeout.flush(0);

      expect($ogAlertsController.alerts).toEqual([{
        id: 124,
        type: 'info',
        message: 'Test Message Info',
        $$data: {
          options: {},
        },
        classes: [],
      }]);
    });
  });

  it('should remove alert on close event', function () {
    initializeController();

    $rootScope.$emit('og-alerts:$$event:open', {
      id: 123,
      type: 'error',
      message: 'Test Message',
      $$data: {
        options: {},
      },
    });

    $rootScope.$emit('og-alerts:$$event:open', {
      id: 124,
      type: 'info',
      message: 'Test Message Info',
      $$data: {
        options: {},
      },
    });

    $rootScope.$apply();

    expect($ogAlertsController.alerts.length).toEqual(2);

    $rootScope.$emit('og-alerts:$$event:close', 123);

    $timeout.flush(0);

    expect($ogAlertsController.alerts).toEqual([{
      id: 124,
      type: 'info',
      message: 'Test Message Info',
      $$data: {
        options: {},
      },
      classes: [],
    }]);
  });

  it('should remove alert on timeout', function () {
    $scope.timeout = 5000;

    initializeController();

    $rootScope.$emit('og-alerts:$$event:open', {
      id: 123,
      type: 'error',
      message: 'Test Message',
      $$data: {
        options: {
          timeout: 8000,
        },
      },
    });

    $rootScope.$emit('og-alerts:$$event:open', {
      id: 124,
      type: 'info',
      message: 'Test Message Info',
      $$data: {
        options: {},
      },
    });

    $rootScope.$apply();

    expect($ogAlertsController.alerts.length).toEqual(2);

    $timeout.flush(5000);

    expect($ogAlertsController.alerts).toEqual([{
      id: 123,
      type: 'error',
      message: 'Test Message',
      $$data: {
        options: {
          timeout: 8000,
        },
      },
      classes: ['alert-error', 'alert-test'],
    }]);

    $timeout.flush(8000);

    expect($ogAlertsController.alerts).toEqual([]);
  });

  it('should not remove alert when timeout is false', function () {
    initializeController();

    $rootScope.$emit('og-alerts:$$event:open', {
      id: 123,
      type: 'error',
      message: 'Test Message',
      $$data: {
        options: {},
      },
    });

    $rootScope.$apply();

    expect($ogAlertsController.alerts.length).toEqual(1);

    $timeout.flush(50000000000);

    expect($ogAlertsController.alerts).toEqual([{
      id: 123,
      type: 'error',
      message: 'Test Message',
      $$data: {
        options: {},
      },
      classes: ['alert-error', 'alert-test'],
    }]);
  });

  it('should do nothing if alert was already removed', function () {
    initializeController();

    $rootScope.$emit('og-alerts:$$event:open', {
      id: 123,
      type: 'error',
      message: 'Test Message',
      $$data: {
        options: {},
      },
    });

    $rootScope.$apply();

    expect($ogAlertsController.alerts.length).toEqual(1);

    $rootScope.$emit('og-alerts:$$event:close', 124);

    $timeout.flush(0);

    expect($ogAlertsController.alerts).toEqual([{
      id: 123,
      type: 'error',
      message: 'Test Message',
      $$data: {
        options: {},
      },
      classes: ['alert-error', 'alert-test'],
    }]);
  });

  it('should queue alerts if limit reached', function () {
    initializeController();

    $rootScope.$emit('og-alerts:$$event:open', {
      id: 123,
      type: 'info',
      message: 'Test Message 1',
      $$data: {
        options: {},
      },
    });

    $rootScope.$emit('og-alerts:$$event:open', {
      id: 124,
      type: 'info',
      message: 'Test Message 2',
      $$data: {
        options: {},
      },
    });

    $rootScope.$emit('og-alerts:$$event:open', {
      id: 125,
      type: 'info',
      message: 'Test Message 3',
      $$data: {
        options: {},
      },
    });

    $rootScope.$emit('og-alerts:$$event:open', {
      id: 126,
      type: 'info',
      message: 'Test Message 4',
      $$data: {
        options: {},
      },
    });

    $rootScope.$apply();

    expect($ogAlertsController.alerts).toEqual([{
      id: 123,
      type: 'info',
      message: 'Test Message 1',
      $$data: {
        options: {},
      },
      classes: [],
    }, {
      id: 124,
      type: 'info',
      message: 'Test Message 2',
      $$data: {
        options: {},
      },
      classes: [],
    }]);

    $ogAlertsController.close(124);

    $timeout.flush(0);

    expect($ogAlertsController.alerts).toEqual([{
      id: 123,
      type: 'info',
      message: 'Test Message 1',
      $$data: {
        options: {},
      },
      classes: [],
    }, {
      id: 125,
      type: 'info',
      message: 'Test Message 3',
      $$data: {
        options: {},
      },
      classes: [],
    }]);
  });
});