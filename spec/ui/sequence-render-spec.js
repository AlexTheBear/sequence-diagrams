var MockRequire = require('mock-require');

var MockFabric = require('./mock-fabric.js');
var MockArrow = require('./mock-arrow.js');

MockRequire('fabric',MockFabric);
MockRequire('../../src/ui/arrow.js',MockArrow);

var Render = require('../../src/ui/sequence-render.js');
var Sequence = require('../../src/sequence.js');
var Title = require('../../src/title.js');
var Event = require('../../src/event.js');
var Participant = require('../../src/participant.js');

describe("A Sequence Render",function(){
  var options = {
    linePadding: 10,
    participantPadding: 10,
    eventLine: {
      text: {
        fontSize: 20
      },
      arrow: {
        stoke: 'red',
        width: 0,
        height: 0,
        loopback : {
          paddingVertical: 0,
          paddingHorizontal: 0
        }
      }
    },
    participant: {
      padding: 0,
      fontSize: 20
    }
  }

  describe("should layout vertically",function(){
    it("a title",function(){
      var sequence = Sequence([
        Title('50,20')
      ]);

      var render = Render('someId',options);

      render.update(sequence);

      expect(render.height()).toBe(20);
    });

    it("a participant",function(){
      var sequence = Sequence([
        Participant('50,20')
      ]);

      var render = Render('someId',options);

      render.update(sequence);

      expect(render.height()).toBe(20);
    });

    it("participants with various heights",function(){
      var sequence = Sequence([
        Participant('50,20'),
        Participant('50,30'),
        Participant('50,20')
      ]);

      var render = Render('someId',options);

      render.update(sequence);

      expect(render.height()).toBe(30);
    });

    it("title and a participant",function(){
      var sequence = Sequence([
        Title('50,20'),
        Participant('50,20')
      ]);

      var render = Render('someId',options);

      render.update(sequence);

      expect(render.height()).toBe(50);
    });

    it("a single statement, which should also show inferred Participants",function(){
      var sequence = Sequence([
        Event(Participant('50,20'),'->',Participant('50,20'),'40,20')
      ]);

      var render = Render('someId',options);

      render.update(sequence);

      expect(render.height()).toBe(50);
    });

    it("titles, participants & statements",function(){
      var sequence = Sequence([
        Title('50,20'),
        Participant('50,20'),
        Event(Participant('50,20'),'->',Participant('50,20'),'40,20')
      ]);

      var render = Render('someId',options);

      render.update(sequence);

      expect(render.height()).toBe(80);
    })
  });

  describe("should layout horizontally",function(){
    it("a title",function(){
      var sequence = Sequence([
        Title('50,20')
      ]);

      var render = Render('someId',options);

      render.update(sequence);

      expect(render.layout().title.left).toBe(0);
    })

    it("a title with participants wider than title should centre horizontally",function(){
      var sequence = Sequence([
        Title('50,20'),
        Participant('100,20')
      ]);

      var render = Render('someId',options);

      render.update(sequence);

      expect(render.layout().title.left).toBe((100-50)/2);
    })

    it("a title with participants less wide than title should centre horizontally",function(){
      var sequence = Sequence([
        Title('50,20'),
        Participant('10,20')
      ]);

      var render = Render('someId',options);

      render.update(sequence);

      expect(render.layout().title.left).toBe(0);
    })

    it("a participant wider than events",function(){
      var sequence = Sequence([
        Participant('10,20'),
        Participant('100,20'),
        Event(Participant('10,20'),'->',Participant('100,20'),'10,10')
      ]);

      var render = Render('someId',options);

      render.update(sequence);

      expect(render.layout().participants[0].left).toBe(0);
      expect(render.layout().participants[1].left).toBe(20);
      expect(render.layout().statements[0].left).toBe(10/2);
      expect(render.layout().statements[0].width).toBe(10/2+10+100/2);
      expect(render.layout().width).toBe(10+10+100);
    })

    it("some step by step events",function(){
      var sequence = Sequence([
        Event(Participant('2,1'),'->',Participant('2,2'),'40,10'),
        Event(Participant('2,2'),'->',Participant('2,3'),'40,10')
      ]);

      var render = Render('someId',options);

      render.update(sequence);

      expect(render.layout().statements[0].left).toBe(1);
      expect(render.layout().statements[1].left).toBe(1+40);
      expect(render.layout().width).toBe(2/2+40+40+2/2);
    });

    it("with an orphaned participant that events skip over",function(){
      var sequence = Sequence([
        Participant('2,1'),
        Participant('2,2'),
        Participant('2,3'),
        Event(Participant('2,1'),'->',Participant('2,3'),'80,10')
      ]);

      var render = Render('someId',options);

      render.update(sequence);

      expect(render.layout().participants[1].left).toBe(2+10);
      expect(render.layout().participants[2].left).toBe(2/2+80-2/2);
      expect(render.layout().statements[0].left).toBe(2/2);
      expect(render.layout().statements[0].width).toBe(80);
      expect(render.layout().width).toBe(2/2+80+2/2);
    });

    it("with step by steps events with a large skip",function(){
      var sequence = Sequence([
        Event(Participant('2,1'),'->',Participant('2,2'),'20,10'),
        Event(Participant('2,2'),'->',Participant('2,3'),'20,10'),
        Event(Participant('2,1'),'->',Participant('2,3'),'100,10')
      ]);

      var render = Render('someId',options);

      render.update(sequence);

      expect(render.layout().participants[2].left).toBe(2/2+100-2/2);
      expect(render.layout().width).toBe(2/2+100+2/2);
    });

    it("with step by steps events with a large skip and then another step",function(){
      var sequence = Sequence([
        Event(Participant('2,1'),'->',Participant('2,2'),'20,10'),
        Event(Participant('2,2'),'->',Participant('2,3'),'20,10'),
        Event(Participant('2,1'),'->',Participant('2,3'),'100,10'),
        Event(Participant('2,3'),'->',Participant('2,4'),'20,10')
      ]);

      var render = Render('someId',options);

      render.update(sequence);

      expect(render.layout().participants[3].left).toBe(2/2+120-2/2);
      expect(render.layout().width).toBe(2/2+100+20+2/2);
    });

    it("with a loopback event on the final participant",function(){
      var sequence = Sequence([
        Event(Participant('2,1'),'->',Participant('2,2'),'20,10'),
        Event(Participant('2,2'),'->',Participant('2,2'),'20,10')
      ]);

      var render = Render('someId',options);

      render.update(sequence);

      expect(render.layout().width).toBe(2/2+20+20);
    })
  });
});
