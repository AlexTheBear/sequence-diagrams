var NamedBlock = require("../src/named-block.js");
var AutoNumber = require("../src/auto-number.js");
var Title = require("../src/title.js");

describe("A Name Block", function() {
  it("with a name and one statement", function() {
    var nb = NamedBlock('My Name',[AutoNumber()]);
    var output = '"My Name"\r\n\tautonumber off';

    expect(nb.stringify()).toBe(output);
  });

  it("with a name and several statements", function() {
    var nb = NamedBlock('My Name',[Title('My Title'),AutoNumber(5)]);
    var output = '"My Name"\r\n\ttitle "My Title"\r\n\tautonumber 5';

    expect(nb.stringify()).toBe(output);
  });
});
