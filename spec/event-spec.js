var Event = require("../src/event.js");

describe("Suite for testing Event objects", function() {
  it("Check we stringify correctly for a simple event", function() {
    var e = Event('Left Actor','->','Right Actor','A message');

    expect(e.stringify()).toBe('"Left Actor"->"Right Actor": "A message"');
  });
});
