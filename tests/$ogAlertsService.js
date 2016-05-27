/**
 * $ogAlerts service tests
 */
describe('$ogAlerts', function () {
  var $ogAlerts, $rootScope;

  describe('without $translate service', function () {
    // load the ogAlerts module
    beforeEach(angular.mock.module('ogAlerts'));

    // inject services
    beforeEach(inject(function (_$ogAlerts_, _$rootScope_) {
      $ogAlerts = _$ogAlerts_;
      $rootScope = _$rootScope_;

      spyOn($rootScope, '$emit');
    }));

    it('should be defined', function () {
      expect($ogAlerts).toBeDefined();
    });

    describe('show()', function () {
      it('should create an alert', function () {
        var alert = $ogAlerts.show('test-type', 'Test Msg');

        expect(alert.id).toEqual(1);
        expect(alert.close).toEqual(jasmine.any(Function));

        // propagate promise resolution
        $rootScope.$apply();

        expect($rootScope.$emit).toHaveBeenCalledWith('og-alerts:$$event:open', {
          id: 1,
          type: 'test-type',
          message: 'Test Msg',
          $$data: {
            options: {},
            deferreds: {
              onClose: jasmine.any(Object),
              onQueue: jasmine.any(Object),
              onDisplay: jasmine.any(Object),
            },
          }
        });
      });

      it('should allow to specify options', function () {
        var alert = $ogAlerts.show('test-type', 'Test Msg', null, { option1: 'test' });

        // propagate promise resolution
        $rootScope.$apply();

        expect($rootScope.$emit).toHaveBeenCalledWith('og-alerts:$$event:open', {
          id: 1,
          type: 'test-type',
          message: 'Test Msg',
          $$data: {
            options: { option1: 'test' },
            deferreds: {
              onClose: jasmine.any(Object),
              onQueue: jasmine.any(Object),
              onDisplay: jasmine.any(Object),
            },
          }
        });
      });

      it('should allow the alert to be closed', function () {
        var alert = $ogAlerts.show('test-type', 'Test Msg');

        alert.close();

        expect($rootScope.$emit).not.toHaveBeenCalled();

        // propagate promise resolution
        $rootScope.$apply();

        expect($rootScope.$emit).toHaveBeenCalledWith('og-alerts:$$event:close', 1);
      });
    });

    describe('error()', function () {
      it('should create an alert of type error', function () {
        var alert = $ogAlerts.error('Test Msg');

        // propagate promise resolution
        $rootScope.$apply();

        expect($rootScope.$emit).toHaveBeenCalledWith('og-alerts:$$event:open', {
          id: 1,
          type: 'error',
          message: 'Test Msg',
          $$data: {
            options: {},
            deferreds: {
              onClose: jasmine.any(Object),
              onQueue: jasmine.any(Object),
              onDisplay: jasmine.any(Object),
            },
          }
        });
      });

      it('should allow to specify options', function () {
        var alert = $ogAlerts.error('Test Msg', null, { option1: 'test' });

        // propagate promise resolution
        $rootScope.$apply();

        expect($rootScope.$emit).toHaveBeenCalledWith('og-alerts:$$event:open', {
          id: 1,
          type: 'error',
          message: 'Test Msg',
          $$data: {
            options: { option1: 'test' },
            deferreds: {
              onClose: jasmine.any(Object),
              onQueue: jasmine.any(Object),
              onDisplay: jasmine.any(Object),
            },
          }
        });
      });
    });

    describe('warn()', function () {
      it('should create an alert of type warn', function () {
        var alert = $ogAlerts.warn('Test Msg');

        // propagate promise resolution
        $rootScope.$apply();

        expect($rootScope.$emit).toHaveBeenCalledWith('og-alerts:$$event:open', {
          id: 1,
          type: 'warn',
          message: 'Test Msg',
          $$data: {
            options: {},
            deferreds: {
              onClose: jasmine.any(Object),
              onQueue: jasmine.any(Object),
              onDisplay: jasmine.any(Object),
            },
          }
        });
      });

      it('should allow to specify options', function () {
        var alert = $ogAlerts.warn('Test Msg', null, { option1: 'test' });

        // propagate promise resolution
        $rootScope.$apply();

        expect($rootScope.$emit).toHaveBeenCalledWith('og-alerts:$$event:open', {
          id: 1,
          type: 'warn',
          message: 'Test Msg',
          $$data: {
            options: { option1: 'test' },
            deferreds: {
              onClose: jasmine.any(Object),
              onQueue: jasmine.any(Object),
              onDisplay: jasmine.any(Object),
            },
          }
        });
      });
    });

    describe('info()', function () {
      it('should create an alert of type info', function () {
        var alert = $ogAlerts.info('Test Msg');

        // propagate promise resolution
        $rootScope.$apply();

        expect($rootScope.$emit).toHaveBeenCalledWith('og-alerts:$$event:open', {
          id: 1,
          type: 'info',
          message: 'Test Msg',
          $$data: {
            options: {},
            deferreds: {
              onClose: jasmine.any(Object),
              onQueue: jasmine.any(Object),
              onDisplay: jasmine.any(Object),
            },
          }
        });
      });

      it('should allow to specify options', function () {
        var alert = $ogAlerts.info('Test Msg', null, { option1: 'test' });

        // propagate promise resolution
        $rootScope.$apply();

        expect($rootScope.$emit).toHaveBeenCalledWith('og-alerts:$$event:open', {
          id: 1,
          type: 'info',
          message: 'Test Msg',
          $$data: {
            options: { option1: 'test' },
            deferreds: {
              onClose: jasmine.any(Object),
              onQueue: jasmine.any(Object),
              onDisplay: jasmine.any(Object),
            },
          }
        });
      });
    });

    describe('success()', function () {
      it('should create an alert of type success', function () {
        var alert = $ogAlerts.success('Test Msg');

        // propagate promise resolution
        $rootScope.$apply();

        expect($rootScope.$emit).toHaveBeenCalledWith('og-alerts:$$event:open', {
          id: 1,
          type: 'success',
          message: 'Test Msg',
          $$data: {
            options: {},
            deferreds: {
              onClose: jasmine.any(Object),
              onQueue: jasmine.any(Object),
              onDisplay: jasmine.any(Object),
            },
          }
        });
      });

      it('should allow to specify options', function () {
        var alert = $ogAlerts.success('Test Msg', null, { option1: 'test' });

        // propagate promise resolution
        $rootScope.$apply();

        expect($rootScope.$emit).toHaveBeenCalledWith('og-alerts:$$event:open', {
          id: 1,
          type: 'success',
          message: 'Test Msg',
          $$data: {
            options: { option1: 'test' },
            deferreds: {
              onClose: jasmine.any(Object),
              onQueue: jasmine.any(Object),
              onDisplay: jasmine.any(Object),
            },
          }
        });
      });
    });

    describe('closeAll()', function () {
      it('should emit close all event', function () {
        $ogAlerts.closeAll();

        expect($rootScope.$emit).toHaveBeenCalledWith('og-alerts:$$event:close');
      });
    });
  });

  describe('with $translate service', function () {
    var $translate, $q;

    // load the ogAlerts module
    beforeEach(angular.mock.module('ogAlerts', function ($provide) {
      // mock $translate service
      $translate = jasmine.createSpy('$translate').and.callFake(function (msg) {
        return $q.resolve('TRANSLATED: ' + msg);
      });

      $provide.value('$translate', $translate);
    }));

    // inject services
    beforeEach(inject(function (_$ogAlerts_, _$rootScope_, _$q_) {
      $ogAlerts = _$ogAlerts_;
      $rootScope = _$rootScope_;
      $q = _$q_;

      spyOn($rootScope, '$emit');
    }));

    describe('show()', function () {
      it('should create an alert', function () {
        var alert = $ogAlerts.show('test-type', 'Test Msg');

        expect(alert.id).toEqual(1);
        expect(alert.close).toEqual(jasmine.any(Function));

        // propagate promise resolution
        $rootScope.$apply();

        expect($translate).toHaveBeenCalledWith('Test Msg', undefined);

        expect($rootScope.$emit).toHaveBeenCalledWith('og-alerts:$$event:open', {
          id: 1,
          type: 'test-type',
          message: 'TRANSLATED: Test Msg',
          $$data: {
            options: {},
            deferreds: {
              onClose: jasmine.any(Object),
              onQueue: jasmine.any(Object),
              onDisplay: jasmine.any(Object),
            },
          }
        });
      });

      it('should allow to specify translation params', function () {
        var alert = $ogAlerts.show('test-type', 'Test Msg', { key: 'value' });

        // propagate promise resolution
        $rootScope.$apply();

        expect($translate).toHaveBeenCalledWith('Test Msg', { key: 'value' });

        expect($rootScope.$emit).toHaveBeenCalledWith('og-alerts:$$event:open', {
          id: 1,
          type: 'test-type',
          message: 'TRANSLATED: Test Msg',
          $$data: {
            options: {},
            deferreds: {
              onClose: jasmine.any(Object),
              onQueue: jasmine.any(Object),
              onDisplay: jasmine.any(Object),
            },
          }
        });
      });
    });
  });
});