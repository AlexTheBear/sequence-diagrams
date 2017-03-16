var AutoNumber = require("../src/auto-number.js");

describe("Suite for testing AutoNumber objects", function() {
  it("Check we stringify correctly for switching autonumbering on", function() {
    var an = AutoNumber(12);

    expect(an.stringify()).toBe('autonumber 12');
  });

  it("Check we stringify correctly for switching autonumbering off", function() {
    var an = AutoNumber();

    expect(an.stringify()).toBe('autonumber off');
  });
});
