describe("events", function() {
  var $, $inputor, app;
  $inputor = null;
  app = null;
  $ = jQuery;
  beforeEach(function() {
    loadFixtures("inputors.html");
    $inputor = $("#inputor").atwho({
      at: "@",
      data: fixtures["names"]
    });
    return app = getAppOf($inputor);
  });
  afterEach(function() {
    return $inputor.atwho('destroy');
  });
  describe("inner", function() {
    var callbacks, controller;
    controller = null;
    callbacks = null;
    beforeEach(function() {
      controller = app.controller();
      callbacks = $.fn.atwho["default"].callbacks;
      return simulateTypingIn($inputor);
    });
    it("trigger esc", function() {
      var esc_event;
      esc_event = $.Event("keyup.atwhoInner", {
        keyCode: KEY_CODE.ESC
      });
      $inputor.trigger(esc_event);
      return expect(controller.view.visible()).toBe(false);
    });
    it("trigger tab", function() {
      var tab_event;
      spyOn(callbacks, "beforeInsert").and.callThrough();
      tab_event = $.Event("keydown.atwhoInner", {
        keyCode: KEY_CODE.TAB
      });
      $inputor.trigger(tab_event);
      expect(controller.view.visible()).toBe(false);
      return expect(callbacks.beforeInsert).toHaveBeenCalled();
    });
    it("trigger enter", function() {
      var enter_event;
      spyOn(callbacks, "beforeInsert").and.callThrough();
      enter_event = $.Event("keydown.atwhoInner", {
        keyCode: KEY_CODE.ENTER
      });
      $inputor.trigger(enter_event);
      return expect(callbacks.beforeInsert).toHaveBeenCalled();
    });
    it("trigger up", function() {
      var up_event;
      spyOn(controller.view, "prev").and.callThrough();
      up_event = $.Event("keydown.atwhoInner", {
        keyCode: KEY_CODE.UP
      });
      $inputor.trigger(up_event);
      return expect(controller.view.prev).toHaveBeenCalled();
    });
    it("trigger down", function() {
      var down_event;
      spyOn(controller.view, "next").and.callThrough();
      down_event = $.Event("keydown.atwhoInner", {
        keyCode: KEY_CODE.DOWN
      });
      $inputor.trigger(down_event);
      return expect(controller.view.next).toHaveBeenCalled();
    });
    it("trigger up(ctrl + p)", function() {
      var up_event;
      spyOn(controller.view, "prev").and.callThrough();
      up_event = $.Event("keydown.atwhoInner", {
        keyCode: KEY_CODE.P,
        ctrlKey: true
      });
      $inputor.trigger(up_event);
      return expect(controller.view.prev).toHaveBeenCalled();
    });
    it("trigger down(ctrl + n)", function() {
      var down_event;
      spyOn(controller.view, "next").and.callThrough();
      down_event = $.Event("keydown.atwhoInner", {
        keyCode: KEY_CODE.N,
        ctrlKey: true
      });
      $inputor.trigger(down_event);
      return expect(controller.view.next).toHaveBeenCalled();
    });
    it("trigger p", function() {
      var p_event;
      spyOn(controller.view, "prev").and.callThrough();
      p_event = $.Event("keydown.atwhoInner", {
        keyCode: KEY_CODE.P,
        ctrlKey: false
      });
      $inputor.trigger(p_event);
      return expect(controller.view.prev).not.toHaveBeenCalled();
    });
    return it("trigger n", function() {
      var n_event;
      spyOn(controller.view, "prev").and.callThrough();
      n_event = $.Event("keydown.atwhoInner", {
        keyCode: KEY_CODE.N,
        ctrlKey: false
      });
      $inputor.trigger(n_event);
      return expect(controller.view.prev).not.toHaveBeenCalled();
    });
  });
  return describe("atwho", function() {
    it("trigger matched", function() {
      var matched_event;
      matched_event = spyOnEvent($inputor, "matched.atwho");
      triggerAtwhoAt($inputor);
      return expect(matched_event).toHaveBeenTriggered();
    });
    it("trigger inserted", function() {
      var choose_event;
      choose_event = spyOnEvent($inputor, "inserted.atwho");
      triggerAtwhoAt($inputor);
      return expect(choose_event).toHaveBeenTriggered();
    });
    it("trigger reposition", function() {
      var reposition_event;
      reposition_event = spyOnEvent($inputor, "reposition.atwho");
      triggerAtwhoAt($inputor);
      return expect(reposition_event).toHaveBeenTriggered();
    });
    it("trigger a special matched for @ with alias", function() {
      var event;
      $inputor.atwho({
        at: "@",
        alias: "at-memtions"
      });
      event = spyOnEvent($inputor, "matched-at-memtions.atwho");
      triggerAtwhoAt($inputor);
      return expect(event).toHaveBeenTriggered();
    });
    return it("trigger beforeDestroy", function() {
      var destroy_event;
      destroy_event = spyOnEvent($inputor, "beforeDestroy.atwho");
      $inputor.atwho('destroy');
      return expect(destroy_event).toHaveBeenTriggered();
    });
  });
});
