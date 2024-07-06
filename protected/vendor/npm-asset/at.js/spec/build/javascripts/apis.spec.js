var $inputor, app;

$inputor = null;

app = null;

describe("api", function() {
  var $;
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
      jasmine.Ajax.install();
      return controller = app.controller();
    });
    afterEach(function() {
      return jasmine.Ajax.uninstall();
    });
    it("can get current data", function() {
      simulateTypingIn($inputor);
      return expect(controller.model.fetch().length).toBe(24);
    });
    it("can save current data", function() {
      var data;
      simulateTypingIn($inputor);
      data = [
        {
          id: 1,
          name: "one"
        }, {
          id: 2,
          name: "two"
        }
      ];
      controller.model.save(data);
      return expect(controller.model.fetch().length).toBe(2);
    });
    return it("don't change data setting while using remote filter", function() {
      var request, response_data;
      $inputor.atwho({
        at: "@",
        data: "/atwho.json"
      });
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
      expect(controller.getOpt("data")).toBe("/atwho.json");
      return expect(controller.model.fetch().length).toBe(3);
    });
  });
  return describe("public", function() {
    var controller, data;
    controller = null;
    data = [];
    beforeEach(function() {
      controller = app.controller();
      return data = [
        {
          one: 1
        }, {
          two: 2
        }, {
          three: 3
        }
      ];
    });
    it("can load data for special flag", function() {
      $inputor.atwho("load", "@", data);
      return expect(controller.model.fetch().length).toBe(data.length);
    });
    it("can load data with alias", function() {
      $inputor.atwho({
        at: "@",
        alias: "at"
      });
      $inputor.atwho("load", "at", data);
      return expect(controller.model.fetch().length).toBe(data.length);
    });
    it("can run it handly", function() {
      app.setContextFor(null);
      $inputor.caret('pos', 31);
      $inputor.atwho("run");
      return expect(app.controller().view.$el).not.toBeHidden();
    });
    it('destroy', function() {
      var view_id;
      $inputor.atwho({
        at: "~"
      });
      view_id = app.controller('~').view.$el.attr('id');
      $inputor.atwho('destroy');
      expect($("#" + view_id).length).toBe(0);
      expect($inputor.data('atwho')).toBe(null);
      return expect($inputor.data('~')).toBe(null);
    });
    return it('isSelecting correctness', function() {
      expect($inputor.atwho('isSelecting')).toBe(false);
      simulateTypingIn($inputor);
      return expect($inputor.atwho('isSelecting')).toBe(true);
    });
  });
});
