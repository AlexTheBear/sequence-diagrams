var Event = require("../src/event.js");
var Participant = require("../src/participant.js");

describe("Suite for testing Event objects", function() {
  it("Check we stringify correctly for a simple event", function() {
    var e = Event(Participant('Left Actor'),{arrowRight:Event.ARROW_RIGHT_CLOSED,lineType:Event.LINE_SOLID},Participant('Right Actor'),'A message');

    expect(e.stringify()).toBe('"Left Actor"->"Right Actor": "A message"');
  });
});
