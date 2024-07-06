var $inputor, app;

$inputor = null;

app = null;

describe("default callbacks", function() {
  var $, callbacks, text;
  $ = jQuery;
  callbacks = null;
  text = null;
  beforeEach(function() {
    loadFixtures("inputors.html");
    $inputor = $("#inputor").atwho({
      at: "@",
      data: fixtures["names"]
    });
    return app = getAppOf($inputor);
  });
  beforeEach(function() {
    text = $.trim($inputor.text());
    callbacks = $.fn.atwho["default"].callbacks;
    return app = $inputor.data("atwho");
  });
  afterEach(function() {
    return $inputor.atwho('destroy');
  });
  it("refactor the data before save", function() {
    var items;
    items = callbacks.beforeSave.call(app.controller(), fixtures["names"]);
    expect(items).toContain({
      "name": "Jacob"
    });
    return expect(items).toContain({
      "name": "Isabella"
    });
  });
  it("should match the key word following @", function() {
    var query;
    query = callbacks.matcher.call(app, "@", text);
    return expect(query).toBe("Jobs");
  });
  it("should not match a space following @ if acceptSpaceBar flag omitted", function() {
    var query;
    $inputor = $("#inputor").atwho({
      at: "@",
      data: fixtures["names"]
    });
    text = $.trim($inputor.text());
    query = callbacks.matcher.call(app, "@", text);
    return expect(query).toBe("Jobs");
  });
  it("should not match a space following @ if acceptSpaceBar flag false", function() {
    var query;
    $inputor = $("#inputor").atwho({
      at: "@",
      data: fixtures["names"],
      acceptSpaceBar: false
    });
    text = $.trim($inputor.text());
    query = callbacks.matcher.call(app, "@", text, false, false);
    return expect(query).toBe("Jobs");
  });
  it("should match a space following @ if acceptSpaceBar flag set to true", function() {
    var query;
    $inputor = $("#inputor4").atwho({
      at: "@",
      data: fixtures["names"],
      acceptSpaceBar: true
    });
    text = $.trim($inputor.text());
    query = callbacks.matcher.call(app, "@", text, false, true);
    return expect(query).toBe("Jobs Blobs");
  });
  it("should match the key word fllowing @ with specials chars", function() {
    var query;
    $inputor = $("#special-chars").atwho({
      at: "@",
      data: fixtures["names"]
    });
    text = $.trim($inputor.text());
    query = callbacks.matcher.call(app, "@", text);
    return expect(query).toBe(decodeURI("J%C3%A9r%C3%A9m%C3%BF"));
  });
  it("can filter data", function() {
    var names;
    names = callbacks.beforeSave.call(app.controller(), fixtures["names"]);
    names = callbacks.filter.call(app, "jo", names, "name");
    return expect(names).toContain({
      name: "Joshua"
    });
  });
  it("can filter numeric data", function() {
    var numerics;
    numerics = callbacks.beforeSave.call(app.controller(), fixtures["numerics"]);
    numerics = callbacks.filter.call(app, "1", numerics, "name");
    return expect(numerics).toContain({
      name: 10
    });
  });
  it("request data from remote by ajax if set remoteFilter", function() {
    var remote_call;
    remote_call = jasmine.createSpy("remote_call");
    $inputor.atwho({
      at: "@",
      data: null,
      callbacks: {
        remoteFilter: remote_call
      }
    });
    simulateTypingIn($inputor);
    return expect(remote_call).toHaveBeenCalled();
  });
  it("can sort the data", function() {
    var names;
    names = callbacks.beforeSave.call(app.controller(), fixtures["names"]);
    names = callbacks.sorter.call(app, "e", names, "name");
    return expect(names[0].name).toBe('Ethan');
  });
  it("can sort numeric data", function() {
    var numerics;
    numerics = callbacks.beforeSave.call(app.controller(), fixtures["numerics"]);
    numerics = callbacks.sorter.call(app, "1", numerics, "name");
    return expect(numerics[0].name).toBe(13);
  });
  it("don't sort the data without a query", function() {
    var names;
    names = callbacks.beforeSave.call(app.controller(), fixtures["names"]);
    names = callbacks.sorter.call(app, "", names, "name");
    return expect(names[0]).toEqual({
      name: 'Jacob'
    });
  });
  it("can eval temple", function() {
    var html, map, result, tpl;
    map = {
      name: "username",
      nick: "nick_name"
    };
    tpl = '<li data-value="${name}">${nick}</li>';
    html = '<li data-value="username">nick_name</li>';
    result = callbacks.tplEval.call(app, tpl, map);
    return expect(result).toBe(html);
  });
  it("can evaluate template as a function", function() {
    var html, map, result, tpl;
    map = {
      name: "username",
      nick: "nick_name"
    };
    tpl = function(map) {
      return '<li data-value="' + map.name + '">' + map.nick + '</li>';
    };
    html = '<li data-value="username">nick_name</li>';
    result = callbacks.tplEval.call(app, tpl, map);
    return expect(result).toBe(html);
  });
  it("can highlight the query", function() {
    var highlighted, html, result;
    html = '<li data-value="username">Ethan</li>';
    highlighted = callbacks.highlighter.call(app, html, "e");
    result = '<li data-value="username"> <strong>E</strong>than </li>';
    return expect(highlighted).toBe(result);
  });
  it("can insert the text which be choosed", function() {
    spyOn(callbacks, "beforeInsert").and.callThrough();
    triggerAtwhoAt($inputor);
    return expect(callbacks.beforeInsert).toHaveBeenCalled();
  });
  return it("can adjust offset before reposition", function() {
    spyOn(callbacks, "beforeReposition").and.callThrough();
    triggerAtwhoAt($inputor);
    return expect(callbacks.beforeReposition).toHaveBeenCalled();
  });
});
