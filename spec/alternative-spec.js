var NamedBlock = require("../src/named-block.js");
var AutoNumber = require("../src/auto-number.js");
var Title = require("../src/title.js");
var Alternative = require("../src/alternative.js");

describe("An alternate block", function() {
  it("with just one statement", function() {
    var alt = new Alternative(
            [NamedBlock('My Name',[AutoNumber()])]
          );

    var output = 'alt "My Name"\r\n\tautonumber off\r\nend';
    
    expect(alt.stringify()).toBe(output);
  });

  it("with a main and an else block", function() {
    var alt = new Alternative(
          [NamedBlock('My Name',[AutoNumber()]),
          NamedBlock('Else Block',[Title("My Title")])]
        );

    var output = 'alt "My Name"\r\n\tautonumber off\r\nelse "Else Block"\r\n\ttitle "My Title"\r\nend';

    expect(alt.stringify()).toBe(output);
  });

  it("with a main and two else blocks", function() {
    var alt = new Alternative(
            [NamedBlock('My Name',[AutoNumber()]),
            NamedBlock('Else Block',[Title("My Title")]),
            NamedBlock('Other Else Block',[Title("My Title")])]
          );

    var output = 'alt "My Name"\r\n\tautonumber off\r\nelse "Else Block"\r\n\ttitle "My Title"\r\nelse "Other Else Block"\r\n\ttitle "My Title"\r\nend';

    expect(alt.stringify()).toBe(output);
  });

  it("with an empty main block",function(){
    var alt = new Alternative(
            [NamedBlock('Empty',[])]
          );

    var output = 'alt "Empty"\r\nend';
    expect(alt.stringify()).toBe(output);
  });

  it("with an empty main and else block",function(){
    var alt = new Alternative(
            [NamedBlock('Empty',[]),
            NamedBlock('Also Empty',[])]
          );

    var output = 'alt "Empty"\r\nelse "Also Empty"\r\nend';
    expect(alt.stringify()).toBe(output);
  });
});
