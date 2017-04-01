var MockRequire = require('mock-require');

var MockFabric = require('./mock-fabric.js');
var MockArrow = require('./mock-arrow.js');

MockRequire('../../src/ui/arrow.js',MockArrow);
MockRequire('fabric',MockFabric);

var EventLine = require('../../src/ui/event-line.js');
var Event = require('../../src/event.js');
var Participant = require('../../src/participant.js');

describe("An Event Line",function(){
  it("should have minimum dimensions",function(){
    var options = {
      text:{fontSize:20},
      arrow: {stroke:'red',width:0,height:0}
    }

    var eventLine = EventLine(Event(Participant('1,1'),'->',Participant(2,2),'20,10'),options);

    expect(eventLine.minimumDimensions().width).toBe(20);
    expect(eventLine.minimumDimensions().height).toBe(10);
  });

  it("should have minimum dimensions which take account of arrow width",function(){
    var options = {
      text:{fontSize:20},
      arrow: {stroke:'red',width:10,height:0}
    }

    var eventLine = EventLine(Event(Participant('1,1'),'->',Participant(2,2),'20,10'),options);

    expect(eventLine.minimumDimensions().width).toBe(10+20+10);
  });

  it("should have minimum dimensions which take account of arrow height",function(){
    var options = {
      text:{fontSize:20},
      arrow: {stroke:'red',width:0,height:10}
    }

    var eventLine = EventLine(Event(Participant('1,1'),'->',Participant(2,2),'20,20'),options);

    expect(eventLine.minimumDimensions().height).toBe(20+10);
  });

  it("should have minimum dimensions which take account of arrow height which is taller than text",function(){
    var options = {
      text:{fontSize:20},
      arrow: {stroke:'red',width:0,height:20}
    }

    var eventLine = EventLine(Event(Participant('1,1'),'->',Participant(2,2),'20,10'),options);

    expect(eventLine.minimumDimensions().height).toBe(20+20);
  });

  it("should adjust layout for specific dimensions",function(){
    var options = {
      text:{fontSize:20},
      arrow: {stroke:'red',width:10,height:10}
    }

    var eventLine = EventLine(Event(Participant('1,1'),'->',Participant(2,2),'20,10'),options);

    eventLine.dimensions({left:10,top:20,width:100});

    expect(eventLine._group.left).toBe(10);
    expect(eventLine._group.top).toBe(20);
    expect(eventLine._text.left).toBe(10+(100-20-10-10)/2);
  });
});
