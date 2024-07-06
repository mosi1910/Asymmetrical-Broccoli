var $;

$ = jQuery;

this.KEY_CODE = {
  DOWN: 40,
  UP: 38,
  ESC: 27,
  TAB: 9,
  ENTER: 13,
  CTRL: 17,
  P: 80,
  N: 78
};

this.fixtures || (this.fixtures = loadJSONFixtures("data.json")["data.json"]);

this.triggerAtwhoAt = function($inputor) {
  simulateTypingIn($inputor);
  return simulateChoose($inputor);
};

this.simulateTypingIn = function($inputor, flag, pos) {
  var oDocument, oWindow, range, sel;
  if (pos == null) {
    pos = 31;
  }
  $inputor.data("atwho").setContextFor(flag || "@");
  oDocument = $inputor[0].ownerDocument;
  oWindow = oDocument.defaultView || oDocument.parentWindow;
  if ($inputor.attr('contentEditable') === 'true' && oWindow.getSelection) {
    $inputor.focus();
    sel = oWindow.getSelection();
    range = oDocument.createRange();
    range.setStart($inputor.contents().get(0), pos);
    range.setEnd($inputor.contents().get(0), pos);
    range.collapse(false);
    sel.removeAllRanges();
    sel.addRange(range);
  } else {
    $inputor.caret('pos', pos);
  }
  return $inputor.trigger("keyup");
};

this.simulateChoose = function($inputor) {
  var e;
  e = $.Event("keydown", {
    keyCode: KEY_CODE.ENTER
  });
  return $inputor.trigger(e);
};

this.getAppOf = function($inputor, at) {
  if (at == null) {
    at = "@";
  }
  return $inputor.data('atwho').setContextFor(at);
};
