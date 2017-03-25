var MockRequire = require('mock-require');

MockRequire('fabric',
            {
              Canvas: function(){
                return {
                  add: function(){},
                  clear: function(){}
                };
              },
              Line: function(){
                return {
                  getWidth: function() {
                    return 10;
                  }
                }
              },
              Text: function(text){
                var widthHeight = text.split(',');
                var width = parseInt(widthHeight[0]);
                var height = parseInt(widthHeight[1]);

                return {
                  getWidth: function(){
                    return width;
                  },
                  getHeight: function(){
                    return height;
                  }
                }
              }
            });

var Render = require('../../src/ui/sequence-render.js');
var Sequence = require('../../src/sequence.js');
var Title = require('../../src/title.js');
var Event = require('../../src/event.js');
var Participant = require('../../src/participant.js');

describe("A Sequence Render",function(){
  var options = {
    linePadding: 10,
    participantPadding: 10
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

      expect(render.layout().title.left).toBe(25);
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
      expect(render.layout().statements[0].left).toBe(5);
      expect(render.layout().statements[0].width).toBe(65);
      expect(render.layout().width).toBe(120);
    })

    /*it("a step by step events",function(){
      var sequence = Sequence([
        Event(Participant('2,2'),'->',Participant('4,4'),'40,10'),
        Event(Participant('6,6'),'->',Participant('8,8'),'40,10')
      ]);

      var render = Render('someId',options);

      render.update(sequence);

      expect(render.layout().participants[0].left).toBe(0);
      expect(render.layout().participants[1].left).toBe(20);
      expect(render.layout().statements[0].left).toBe(5);
      expect(render.layout().statements[0].width).toBe(65);
      expect(render.layout().width).toBe(120);
    });*/
  });
});
