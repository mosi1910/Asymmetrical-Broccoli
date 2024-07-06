describe("custom callbacks", function() {
  var $, $inputor;
  $inputor = null;
  $ = jQuery;
  beforeEach(function() {
    return loadFixtures("inputors.html");
  });
  afterEach(function() {
    return $inputor.atwho('destroy');
  });
  return describe("remoteFilter()", function() {
    it("only renders the view for data from the latest lookup", function() {
      var app, callbackList, controller, remoteFilter;
      callbackList = [];
      remoteFilter = jasmine.createSpy("remoteFilter").and.callFake(function(_, cb) {
        return callbackList.push(cb);
      });
      $inputor = $("#inputor").atwho({
        at: "@",
        data: [],
        callbacks: {
          remoteFilter: remoteFilter
        }
      });
      $inputor.val('@foo');
      app = getAppOf($inputor);
      controller = app.controller();
      spyOn(controller, 'renderView');
      simulateTypingIn($inputor);
      expect(remoteFilter).toHaveBeenCalled();
      simulateTypingIn($inputor);
      expect(callbackList.length).toBeGreaterThan(1);
      while (callbackList.length > 1) {
        callbackList.shift()(['no renders']);
        expect(controller.renderView).not.toHaveBeenCalled();
      }
      callbackList.shift()(['render']);
      return expect(controller.renderView).toHaveBeenCalled();
    });
    it("does not attempt to render the view after query has been cleared", function() {
      var app, controller, remoteFilter, remoteFilterCb;
      remoteFilterCb = null;
      remoteFilter = jasmine.createSpy("remoteFilter").and.callFake(function(_, cb) {
        return remoteFilterCb = cb;
      });
      $inputor = $("#inputor").atwho({
        at: "@",
        data: [],
        callbacks: {
          remoteFilter: remoteFilter
        }
      });
      app = getAppOf($inputor);
      controller = app.controller();
      spyOn(controller, 'renderView');
      simulateTypingIn($inputor);
      expect(remoteFilter).toHaveBeenCalled();
      $inputor.val('');
      simulateTypingIn($inputor);
      expect(remoteFilter.calls.count()).toEqual(1);
      remoteFilterCb(['should not render']);
      return expect(controller.renderView).not.toHaveBeenCalled();
    });
    return it("does not attempt to render the view after focus has been lost", function() {
      var app, controller, remoteFilter, remoteFilterCb;
      remoteFilterCb = null;
      remoteFilter = jasmine.createSpy("remoteFilter").and.callFake(function(_, cb) {
        return remoteFilterCb = cb;
      });
      $inputor = $("#inputor").atwho({
        at: "@",
        data: [],
        callbacks: {
          remoteFilter: remoteFilter
        }
      });
      app = getAppOf($inputor);
      controller = app.controller();
      spyOn(controller, 'renderView');
      simulateTypingIn($inputor);
      expect(remoteFilter).toHaveBeenCalled();
      $inputor.blur();
      remoteFilterCb(['should not render']);
      return expect(controller.renderView).not.toHaveBeenCalled();
    });
  });
});
