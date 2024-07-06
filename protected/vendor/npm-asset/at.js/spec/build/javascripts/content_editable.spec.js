describe("content editable", function() {
  var $, $inputor, app;
  $inputor = null;
  app = null;
  $ = jQuery;
  beforeEach(function() {
    loadFixtures("inputors.html");
    $inputor = $("#editable").atwho({
      at: "@",
      data: ["Jobs"],
      editableAtwhoQueryAttrs: {
        "class": "hello",
        "data-editor-verified": true
      }
    });
    return app = getAppOf($inputor);
  });
  afterEach(function() {
    return $inputor.atwho('destroy');
  });
  it("can insert content", function() {
    triggerAtwhoAt($inputor);
    return expect($inputor.text()).toContain('@Jobs');
  });
  it("insert by click", function() {
    simulateTypingIn($inputor);
    $inputor.blur();
    app.controller().view.$el.find('ul').children().first().trigger('click');
    return expect($inputor.text()).toContain('@Jobs');
  });
  it("unwrap span.atwho-query after match failed", function() {
    simulateTypingIn($inputor);
    expect($('.atwho-query').length).toBe(1);
    $('.atwho-query').html("@J ");
    simulateTypingIn($inputor, "@", 3);
    return expect($('.atwho-query').length).toBe(0);
  });
  return it("wrap span.atwho-query with customize attrs", function() {
    simulateTypingIn($inputor);
    return expect($('.atwho-query').data('editor-verified')).toBe(true);
  });
});
