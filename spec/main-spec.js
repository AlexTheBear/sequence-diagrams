var main = require("../src/main.js");

describe("A suite", function() {
  it("contains spec with an expectation", function() {
    expect(main.alwaysTrue()).toBe(true);
  });
});
