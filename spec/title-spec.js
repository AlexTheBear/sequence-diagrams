var Title = require("../src/title.js");

describe("Suite for testing Title objects", function() {
  it("Check we stringify correctly for a simple title", function() {
    var t = Title("My Title");

    expect(t.stringify()).toBe('title "My Title"');
  });
});
