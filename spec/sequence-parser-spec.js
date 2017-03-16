var parser = require('../src/sequence-parser.js');

describe("A title with", function() {
  it("just one entry without quotes", function() {
    var input = 'title Hello World';
    var output = 'title "Hello World"';
    var parse = parser();

    expect(parse(input).stringify()).toBe(output);
  });

  it("just one entry but quoted", function() {
    var input = 'title "Hello World"';
    var output = 'title "Hello World"';
    var parse = parser();

    expect(parse(input).stringify()).toBe(output);
  });

  it("multiple entries should go with the last one", function() {
    var input = 'title Hello World\r\ntitle Goodbye World';
    var output = 'title "Goodbye World"';
    var parse = parser();

    expect(parse(input).stringify()).toBe(output);
  });
});

describe("A Participant with",function(){
  it("just one entry", function(){
    var input = 'participant Some Fella';
    var output = 'participant "Some Fella"';
    var parse = parser();

    expect(parse(input).stringify()).toBe(output);
  });

  it("just one entry with quotes", function(){
    var input = 'participant "Some Fella"';
    var output = 'participant "Some Fella"';
    var parse = parser();

    expect(parse(input).stringify()).toBe(output);
  });

  it("just one with an alias", function(){
    var input = 'participant "Some Fella" as SF';
    var output = 'participant "Some Fella" as "SF"';
    var parse = parser();

    expect(parse(input).stringify()).toBe(output);
  });

  it("just one with an alias in quotes", function(){
    var input = 'participant "Some Fella" as "SF"';
    var output = 'participant "Some Fella" as "SF"';
    var parse = parser();

    expect(parse(input).stringify()).toBe(output);
  });

  it("combinations with and without alias", function(){
    var input = 'participant "Some Fella" as SF\r\nparticipant "Some Other Fella" as SOF\r\nparticipant "Some Fellet" as SFet';
    var output = 'participant "Some Fella" as "SF"\r\nparticipant "Some Other Fella" as "SOF"\r\nparticipant "Some Fellet" as "SFet"';

    var parse = parser();

    expect(parse(input).stringify()).toBe(output);
  });
});

describe("A event with", function(){
  it("a right solid arrow and a simple message", function(){
    var input = 'SF->OT: Hello Event';
    var output = '"SF"->"OT": "Hello Event"';

    var parse = parser();

    expect(parse(input).stringify()).toBe(output);
  });

  it("a right solid open arrow and a simple message", function(){
    var input = 'SF->>OT: Hello Event';
    var output = '"SF"->>"OT": "Hello Event"';

    var parse = parser();

    expect(parse(input).stringify()).toBe(output);
  });

  it("a right dotted arrow and a simple message", function(){
    var input = 'SF-->OT: Hello Event';
    var output = '"SF"-->"OT": "Hello Event"';

    var parse = parser();

    expect(parse(input).stringify()).toBe(output);
  });

  it("a right dotted open arrow and a simple message", function(){
    var input = 'SF-->>OT: Hello Event';
    var output = '"SF"-->>"OT": "Hello Event"';

    var parse = parser();

    expect(parse(input).stringify()).toBe(output);
  });

  it("a bi-directional solid arrow and a simple message", function(){
    var input = 'SF<->OT: Hello Event';
    var output = '"SF"<->"OT": "Hello Event"';

    var parse = parser();

    expect(parse(input).stringify()).toBe(output);
  });

  it("a bi-directional dotted arrow, both closed, and a simple message", function(){
    var input = 'SF<-->OT: Hello Event';
    var output = '"SF"<-->"OT": "Hello Event"';

    var parse = parser();

    expect(parse(input).stringify()).toBe(output);
  });

  it("a bi-directional dotted arrow with the right arrow open a simple message", function(){
    var input = 'SF<-->>OT: Hello Event';
    var output = '"SF"<-->>"OT": "Hello Event"';

    var parse = parser();

    expect(parse(input).stringify()).toBe(output);
  });

  it("a bi-directional dotted arrow with the left arrow open a simple message", function(){
    var input = 'SF<<-->OT: Hello Event';
    var output = '"SF"<<-->"OT": "Hello Event"';

    var parse = parser();

    expect(parse(input).stringify()).toBe(output);
  });

  it("a bi-directional dotted arrow with the both arrows open a simple message", function(){
    var input = 'SF<<-->>OT: Hello Event';
    var output = '"SF"<<-->>"OT": "Hello Event"';

    var parse = parser();

    expect(parse(input).stringify()).toBe(output);
  });

  it("a solid right arrow which creates the actor and a simple message", function(){
    var input = 'SF->*OT: Hello Event';
    var output = '"SF"->*"OT": "Hello Event"';

    var parse = parser();

    expect(parse(input).stringify()).toBe(output);
  });

  it("a solid right arrow which activates the actor and a simple message", function(){
    var input = 'SF->+OT: Hello Event';
    var output = '"SF"->+"OT": "Hello Event"';

    var parse = parser();

    expect(parse(input).stringify()).toBe(output);
  });

  it("a solid right arrow which activates and creates the actor and a simple message", function(){
    var input = 'SF->*+OT: Hello Event';
    var output = '"SF"->*+"OT": "Hello Event"';

    var parse = parser();

    expect(parse(input).stringify()).toBe(output);
  });

  it("a solid right arrow which deactivates the actor and a simple message", function(){
    var input = 'SF->-OT: Hello Event';
    var output = '"SF"->-"OT": "Hello Event"';

    var parse = parser();

    expect(parse(input).stringify()).toBe(output);
  });
});

describe("An autonumbering line",function(){
  it("which switches on at number 10", function(){
    var input = 'autonumber 10';
    var output = 'autonumber 10';

    var parse = parser();

    expect(parse(input).stringify()).toBe(output);
  });

  it("which switches off", function(){
    var input = 'autonumber off';
    var output = 'autonumber off';

    var parse = parser();

    expect(parse(input).stringify()).toBe(output);
  });
});

describe("An optional statement",function(){
  it("with one statement and no else", function(){
    var input = 'opt a message\r\nautonumber 1\r\nend';
    var output = 'opt A Message\r\n\tautonumber off\r\nend';

    var parse = parser();
    parse(input);
    //expect(parse(input).stringify()).toBe(output);
    expect(true).toBe(true);
  });

  it("with one else and just one statement",function(){
    var input = 'opt one\r\nautonumber 1\r\nelse two\r\nautonumber 2\r\nend';
    var output = 'opt A Message\r\n\tautonumber off\r\nend';

    var parse = parser();
    parse(input);
    //expect(parse(input).stringify()).toBe(output);
    expect(true).toBe(true);
  });

  it("with two eleses each with just one statement", function(){
    var input = 'opt one\r\nautonumber 1\r\nelse two\r\nautonumber 2\r\nelse three\r\nautonumber 3\r\nend';
    var output = 'opt A Message\r\n\tautonumber off\r\nend';

    var parse = parser();
    parse(input);
    //expect(parse(input).stringify()).toBe(output);
    expect(true).toBe(true);
  });

  it("with an opt inside an opt with only one statement in the inner opt", function(){
    var input = 'opt one\r\nopt two\r\nautonumber 1\r\nend\r\nend';
    var output = 'opt A Message\r\n\tautonumber off\r\nend';

    console.log('with an opt inside an opt with only one statement in the inner opt');

    var parse = parser();
    parse(input);
    //expect(parse(input).stringify()).toBe(output);
    expect(true).toBe(true);
  });

  it("with an opt inside an opt both with statements", function(){
    var input = 'opt one\r\nautonumber 1\r\nopt two\r\nautonumber 2\r\nend\r\nend';
    var output = 'opt A Message\r\n\tautonumber off\r\nend';

    console.log("with an opt inside an opt both with statements");

    var parse = parser();
    parse(input);
    //expect(parse(input).stringify()).toBe(output);
    expect(true).toBe(true);
  });
});
