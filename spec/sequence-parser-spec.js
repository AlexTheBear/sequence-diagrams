var parser = require('../src/sequence-parser.js');

describe("Suite for testing sequences generated from parser", function() {
  it("Title alone is parsed correctly", function() {
    var input = 'title Hello World';
    var output = 'title "Hello World"';
    var parse = parser();

    expect(parse(input).stringify()).toBe(output);
  });

  it("If we have multiple titles then go with the last one", function() {
    var input = 'title Hello World\r\ntitle Goodbye World';
    var output = 'title "Goodbye World"';
    var parse = parser();

    expect(parse(input).stringify()).toBe(output);
  });

  it("Participant alone is parsed correctly", function(){
    var input = 'participant Some Fella';
    var output = 'participant "Some Fella"';
    var parse = parser();

    expect(parse(input).stringify()).toBe(output);
  });

  it("Participant with alias correctly", function(){
    var input = 'participant "Some Fella" as SF';
    var output = 'participant "Some Fella" as "SF"';
    var parse = parser();

    expect(parse(input).stringify()).toBe(output);
  });

  it("Lots of Participants with and without alias", function(){
    var input = 'participant "Some Fella" as SF\r\nparticipant "Some Other Fella" as SOF\r\nparticipant "Some Fellet" as SFet';
    var output = 'participant "Some Fella" as "SF"\r\nparticipant "Some Other Fella" as "SOF"\r\nparticipant "Some Fellet" as "SFet"';

    var parse = parser();

    expect(parse(input).stringify()).toBe(output);
  });
});
