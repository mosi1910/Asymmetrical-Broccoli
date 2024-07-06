describe("views", function() {
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
  return describe("issues", function() {
    var callbacks, controller;
    controller = null;
    callbacks = null;
    beforeEach(function() {
      controller = app.controller();
      callbacks = $.fn.atwho["default"].callbacks;
      return simulateTypingIn($inputor);
    });
    it("selected no highlight(.cur); github issues#234", function() {
      var clickEvent, targetLi;
      simulateTypingIn($inputor);
      expect(targetLi = controller.view.$el.find('ul li:last')).not.toHaveClass('cur');
      spyOn(controller.view, "choose").and.callThrough();
      targetLi.trigger(clickEvent = $.Event("click.atwho-view"));
      return expect(targetLi).toHaveClass('cur');
    });
    return it("only hides on scroll if scrollTop is changed (github issue #305)", function() {
      simulateTypingIn($inputor);
      expect(controller.view.visible()).toBe(true);
      $inputor.trigger('scroll');
      return expect(controller.view.visible()).toBe(true);
    });
  });
});
