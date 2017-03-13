var Participant = require("../src/participant.js");

describe("Suite for testing Participant objects", function() {
  it("Check we stringify correctly for a simple participant", function() {
    var p = Participant("Some Fella");

    expect(p.stringify()).toBe('participant "Some Fella"');
  });

  it("Check we stringify correctly for a participant with an alias", function() {
    var p = Participant("Some Fella","SF");

    expect(p.stringify()).toBe('participant "Some Fella" as "SF"');
  });
});
