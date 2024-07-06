describe("settings", function() {
  var $, $inputor, app, callbacks, controller;
  $inputor = null;
  app = null;
  controller = null;
  callbacks = null;
  $ = jQuery;
  beforeEach(function() {
    loadFixtures("inputors.html");
    $inputor = $("#inputor").atwho({
      at: "@",
      data: fixtures["names"]
    });
    app = getAppOf($inputor);
    controller = app.controller();
    return callbacks = $.fn.atwho["default"].callbacks;
  });
  afterEach(function() {
    return $inputor.atwho('destroy');
  });
  it("update common settings", function() {
    var func, old;
    func = function() {
      return $.noop;
    };
    old = $.extend({}, $.fn.atwho["default"].callbacks);
    $.fn.atwho["default"].callbacks.filter = func;
    $.fn.atwho["default"].limit = 8;
    $inputor = $("<input/>").atwho({
      at: "@"
    });
    controller = $inputor.data('atwho').setContextFor("@").controller();
    expect(controller.callbacks("filter")).toBe(func);
    expect(controller.getOpt("limit")).toBe(8);
    return $.extend($.fn.atwho["default"].callbacks, old);
  });
  it("setting empty at", function() {
    $inputor = $("<input/>").atwho({
      at: ""
    });
    controller = $inputor.data('atwho').controller("");
    return expect(controller).toBeDefined();
  });
  it("update specific settings", function() {
    $inputor.atwho({
      at: "@",
      limit: 3
    });
    return expect(controller.setting.limit).toBe(3);
  });
  it("update callbacks", function() {
    var filter;
    filter = jasmine.createSpy("custom filter");
    spyOn(callbacks, "filter");
    $inputor.atwho({
      at: "@",
      callbacks: {
        filter: filter
      }
    });
    triggerAtwhoAt($inputor);
    expect(filter).toHaveBeenCalled();
    return expect(callbacks.filter).not.toHaveBeenCalled();
  });
  it("setting timeout", function() {
    var view;
    jasmine.clock().install();
    $inputor.atwho({
      at: "@",
      displayTimeout: 500
    });
    simulateTypingIn($inputor);
    $inputor.trigger("blur");
    view = controller.view.$el;
    expect(view).not.toBeHidden();
    jasmine.clock().tick(503);
    expect(view).toBeHidden();
    return jasmine.clock().uninstall();
  });
  it("escape RegExp flag", function() {
    $inputor = $('#inputor2').atwho({
      at: "$",
      data: fixtures["names"]
    });
    controller = $inputor.data('atwho').setContextFor("$").controller();
    simulateTypingIn($inputor, "$");
    return expect(controller.view.visible()).toBe(true);
  });
  it("can be trigger with no space", function() {
    $inputor = $('#inputor3').atwho({
      at: "@",
      data: fixtures["names"],
      startWithSpace: false
    });
    controller = $inputor.data('atwho').setContextFor("@").controller();
    simulateTypingIn($inputor);
    return expect(controller.view.visible()).toBe(true);
  });
  it('highlight first', function() {
    simulateTypingIn($inputor);
    expect(controller.view.$el.find('ul li:first')).toHaveClass('cur');
    $inputor.atwho({
      at: '@',
      highlightFirst: false
    });
    simulateTypingIn($inputor);
    return expect(controller.view.$el.find('ul li:first')).not.toHaveClass('cur');
  });
  it('query out of maxLen', function() {
    $inputor.atwho({
      at: '@',
      maxLen: 0
    });
    simulateTypingIn($inputor);
    return expect(controller.query).toBe(null);
  });
  it('should not build query or run afterMatchFailed callback when out of minLen', function() {
    $inputor = $('#editable').atwho({
      at: '@',
      minLen: 2,
      callbacks: {
        afterMatchFailed: function(at, $el) {
          return $el.replaceWith('<div id="failed-match"></div>');
        }
      }
    });
    simulateTypingIn($inputor);
    expect(controller.query).toBe(null);
    return expect($('#failed-match').length).toBe(0);
  });
  return describe("`data` as url and load remote data", function() {
    beforeEach(function() {
      jasmine.Ajax.install();
      controller = app.controller();
      controller.model.save(null);
      return $inputor.atwho({
        at: "@",
        data: "/atwho.json"
      });
    });
    afterEach(function() {
      return jasmine.Ajax.uninstall();
    });
    it("data should be empty at first", function() {
      return expect(controller.model.fetch().length).toBe(0);
    });
    return it("should load data after focus inputor", function() {
      var request, response_data;
      simulateTypingIn($inputor);
      request = jasmine.Ajax.requests.mostRecent();
      response_data = [
        {
          "name": "Jacob"
        }, {
          "name": "Joshua"
        }, {
          "name": "Jayden"
        }
      ];
      request.respondWith({
        status: 200,
        responseText: JSON.stringify(response_data)
      });
      return expect(controller.model.fetch().length).toBe(3);
    });
  });
});
