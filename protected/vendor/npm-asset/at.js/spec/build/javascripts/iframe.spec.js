describe("iframe editor", function() {
  var $, $inputor, app;
  $inputor = null;
  app = null;
  $ = jQuery;
  beforeEach(function() {
    var doc, ifr, ifrBody;
    loadFixtures("inputors.html");
    ifr = $('#iframeInput')[0];
    doc = ifr.contentDocument || iframe.contentWindow.document;
    if ((ifrBody = doc.body) === null) {
      doc.write("<body></body>");
      ifrBody = doc.body;
    }
    ifrBody.contentEditable = true;
    ifrBody.id = 'ifrBody';
    ifrBody.innerHTML = 'Stay Foolish, Stay Hungry. @Jobs';
    $inputor = $(ifrBody);
    $inputor.atwho('setIframe', ifr);
    $inputor.atwho({
      at: "@",
      data: ['Jobs']
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
  return it("insert by click", function() {
    simulateTypingIn($inputor);
    app.controller().view.$el.find('ul').children().first().trigger('click');
    return expect($inputor.text()).toContain('@Jobs');
  });
});
