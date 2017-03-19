var parser = require('../src/sequence-parser.js');

describe("Sequence Parser - ",function(){
  var parse = parser();

  describe("A title with", function() {
    it("just one entry without quotes", function() {
      var input = 'title Hello World';
      var output = 'title "Hello World"';

      var ret = parse(input).stringify();

      expect(ret).toBe(output);
    });

    it("just one entry but quoted", function() {
      var input = 'title "Hello World"';
      var output = 'title "Hello World"';

      var ret = parse(input).stringify();

      expect(ret).toBe(output);
    });
  });

  describe("A Participant with",function(){
    it("just one entry", function(){
      var input = 'participant Some Fella';
      var output = 'participant "Some Fella"';

      var ret = parse(input).stringify();

      expect(ret).toBe(output);
    });

    it("just one entry with quotes", function(){
      var input = 'participant "Some Fella"';
      var output = 'participant "Some Fella"';

      var ret = parse(input).stringify();

      expect(ret).toBe(output);
    });

    it("just one with an alias", function(){
      var input = 'participant "Some Fella" as SF';
      var output = 'participant "Some Fella" as "SF"';

      var ret = parse(input).stringify();

      expect(ret).toBe(output);
    });

    it("just one with an alias in quotes", function(){
      var input = 'participant "Some Fella" as "SF"';
      var output = 'participant "Some Fella" as "SF"';

      var ret = parse(input).stringify();

      expect(ret).toBe(output);
    });

    it("combinations with and without alias", function(){
      var input = 'participant "Some Fella" as SF\r\nparticipant "Some Other Fella" as SOF\r\nparticipant "Some Fellet" as SFet';
      var output = 'participant "Some Fella" as "SF"\r\nparticipant "Some Other Fella" as "SOF"\r\nparticipant "Some Fellet" as "SFet"';

      var ret = parse(input).stringify();

      expect(ret).toBe(output);
    });
  });

  describe("A event with", function(){
    it("a right solid arrow and a simple message", function(){
      var input = 'SF->OT: Hello Event';
      var output = '"SF"->"OT": "Hello Event"';

      expect(parse(input).stringify()).toBe(output);
    });

    it("a right solid open arrow and a simple message", function(){
      var input = 'SF->>OT: Hello Event';
      var output = '"SF"->>"OT": "Hello Event"';

      expect(parse(input).stringify()).toBe(output);
    });

    it("a right dotted arrow and a simple message", function(){
      var input = 'SF-->OT: Hello Event';
      var output = '"SF"-->"OT": "Hello Event"';

      expect(parse(input).stringify()).toBe(output);
    });

    it("a right dotted open arrow and a simple message", function(){
      var input = 'SF-->>OT: Hello Event';
      var output = '"SF"-->>"OT": "Hello Event"';

      expect(parse(input).stringify()).toBe(output);
    });

    it("a bi-directional solid arrow and a simple message", function(){
      var input = 'SF<->OT: Hello Event';
      var output = '"SF"<->"OT": "Hello Event"';

      expect(parse(input).stringify()).toBe(output);
    });

    it("a bi-directional dotted arrow, both closed, and a simple message", function(){
      var input = 'SF<-->OT: Hello Event';
      var output = '"SF"<-->"OT": "Hello Event"';

      expect(parse(input).stringify()).toBe(output);
    });

    it("a bi-directional dotted arrow with the right arrow open a simple message", function(){
      var input = 'SF<-->>OT: Hello Event';
      var output = '"SF"<-->>"OT": "Hello Event"';

      expect(parse(input).stringify()).toBe(output);
    });

    it("a bi-directional dotted arrow with the left arrow open a simple message", function(){
      var input = 'SF<<-->OT: Hello Event';
      var output = '"SF"<<-->"OT": "Hello Event"';

      expect(parse(input).stringify()).toBe(output);
    });

    it("a bi-directional dotted arrow with the both arrows open a simple message", function(){
      var input = 'SF<<-->>OT: Hello Event';
      var output = '"SF"<<-->>"OT": "Hello Event"';

      expect(parse(input).stringify()).toBe(output);
    });

    it("a solid right arrow which creates the actor and a simple message", function(){
      var input = 'SF->*OT: Hello Event';
      var output = '"SF"->*"OT": "Hello Event"';

      expect(parse(input).stringify()).toBe(output);
    });

    it("a solid right arrow which activates the actor and a simple message", function(){
      var input = 'SF->+OT: Hello Event';
      var output = '"SF"->+"OT": "Hello Event"';

      expect(parse(input).stringify()).toBe(output);
    });

    it("a solid right arrow which activates and creates the actor and a simple message", function(){
      var input = 'SF->*+OT: Hello Event';
      var output = '"SF"->*+"OT": "Hello Event"';

      expect(parse(input).stringify()).toBe(output);
    });

    it("a solid right arrow which deactivates the actor and a simple message", function(){
      var input = 'SF->-OT: Hello Event';
      var output = '"SF"->-"OT": "Hello Event"';

      expect(parse(input).stringify()).toBe(output);
    });
  });

  describe("An autonumbering line",function(){
    it("which switches on at number 10", function(){
      var input = 'autonumber 10';
      var output = 'autonumber 10';

      expect(parse(input).stringify()).toBe(output);
    });

    it("which switches off", function(){
      var input = 'autonumber off';
      var output = 'autonumber off';

      expect(parse(input).stringify()).toBe(output);
    });
  });

  describe("An alternative statement",function(){
    it("with two statements and no else", function(){
      var input = 'alt A message\r\nautonumber 1\r\nautonumber 2\r\nend';
      var output = 'alt "A message"\r\n\tautonumber 1\r\n\tautonumber 2\r\nend';

      expect(parse(input).stringify()).toBe(output);
    });

    it("with one else and just one statement",function(){
      var input = 'alt one\r\nautonumber 1\r\nelse two\r\nautonumber 2\r\nend';
      var output = 'alt "one"\r\n\tautonumber 1\r\nelse "two"\r\n\tautonumber 2\r\nend';

      expect(parse(input).stringify()).toBe(output);
    });

    it("with two eleses each with just one statement", function(){
      var input = 'alt one\r\nautonumber 1\r\nelse two\r\nautonumber 2\r\nelse three\r\nautonumber 3\r\nend';
      var output = 'alt "one"\r\n\tautonumber 1\r\nelse "two"\r\n\tautonumber 2\r\nelse "three"\r\n\tautonumber 3\r\nend';

      expect(parse(input).stringify()).toBe(output);
    });

    it("with an alt inside an alt with only one statement in the inner alt", function(){
      var input = 'alt one\r\nalt two\r\nautonumber 1\r\nend\r\nend';
      var output = 'alt "one"\r\n\talt "two"\r\n\t\tautonumber 1\r\n\tend\r\nend';

      expect(parse(input).stringify()).toBe(output);
    });

    it("with an alt inside an alt which has an else all with statements", function(){
      var input = 'alt one\r\nautonumber 1\r\nalt two\r\nautonumber 2\r\nelse three\r\nautonumber 3\r\nend\r\nend';
      var output = 'alt "one"\r\n\tautonumber 1\r\n\talt "two"\r\n\t\tautonumber 2\r\n\telse "three"\r\n\t\tautonumber 3\r\n\tend\r\nend';

      expect(parse(input).stringify()).toBe(output);
    });
  });
});
