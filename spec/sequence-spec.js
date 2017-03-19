var Title = require('../src/title.js');
var Participant = require('../src/participant.js');
var Event = require('../src/event.js');
var AutoNumber = require('../src/auto-number.js');
var Alternative = require('../src/alternative.js');
var NamedBlock = require('../src/named-block.js');
var Sequence = require('../src/sequence.js');

describe("A Sequence",function(){
  it("should move all participant statements to the top with no block statements, retaining order", function(){
    var expected = 'participant "One"\r\nparticipant "Two"\r\nautonumber 1\r\nautonumber 2';

    var sequence = Sequence([
      AutoNumber(1),
      Participant("One"),
      AutoNumber(2),
      Participant("Two"),
    ])

    expect(sequence.stringify()).toBe(expected);
  });

  it("should move all participant statements to the top event if they're in blocks, retaining order", function(){
    var expected = 'participant "one"\r\nparticipant "two"\r\nalt "one block"\r\n\talt "inner block"\r\n\tend\r\nend';

    var sequence = Sequence([
      Alternative([
        NamedBlock('one block',[
          Participant('one'),
          Alternative([
            NamedBlock('inner block',[
              Participant('two')
            ])
          ])
        ])
      ])
    ])

    expect(sequence.stringify()).toBe(expected);
  });

  it("should keep the order of participant statements at first level and sub-blocks",function(){
    var expected = 'participant "one"\r\nparticipant "two"\r\nalt "one block"\r\nend';

    var sequence = Sequence([
      Alternative([
        NamedBlock('one block',[
          Participant('one')
        ])
      ]),
      Participant('two')
    ]);

    expect(sequence.stringify()).toBe(expected);
  });

  it("should move title statements to the top followed by participants, retaining order", function(){
    var expected = 'title "One"\r\nparticipant "Two"\r\nautonumber 1\r\nautonumber 2';

    var sequence = Sequence([
      AutoNumber(1),
      Participant("Two"),
      AutoNumber(2),
      Title("One"),
    ])

    expect(sequence.stringify()).toBe(expected);
  });

  it("should move title statements to the top followed by participants even if they're in sub-blocks, retaining order", function(){
    var expected = 'title "One"\r\nparticipant "Two"\r\nautonumber 1\r\nalt "block"\r\nend';

    var sequence = Sequence([
      AutoNumber(1),
      Alternative([
        NamedBlock('block',[Participant("Two")])
      ]),
      Title("One"),
    ])

    expect(sequence.stringify()).toBe(expected);
  });

  it("should deduplicate titles, choosing the last title statement as the 'truth'",function(){
    var expected = 'title "Two"';

    var sequence = Sequence([
      Title("One"),
      Title("Two")
    ])

    expect(sequence.stringify()).toBe(expected);
  });

  /*
    Note: DEVIATION_FROM_SPEC(2)

    Description#1:  Websequence diagrams chooses the last declared participant, I don't like this behaviour
                    so have implemented it as the first declared participant taking precidence

    Description#2:  There is a quirk in websequence diagrams around participants where if there is a deduplicate
                    alias it uses the last participant statement for the long name but still creates the earlier
                    declared actor, despite it being 'unreachable'. This behaviour is NOT replicated here.
                    Steps to reproduce:
                      participant "AA" as A
                      participant "BB" as B
                      participant "AAA" as A

                      A->B: Hi
                    Output:
                      AA    BB    AAA
                      |     |--hi->|
                      AA    BB    AAA
  */
  it("should deduplicate participants, choosing the last participant statement as the 'truth'",function(){
    var expected = 'participant "One" as "A"';

    var sequence = Sequence([
      Participant("One","A"),
      Participant("Two","A")
    ])

    expect(sequence.stringify()).toBe(expected);
  });

  it("should be fine with an alias and a non-alias participant statement sharing a name",function(){
    var expected = 'participant "One" as "A"\r\nparticipant "One"';

    var sequence = Sequence([
      Participant("One","A"),
      Participant("One")
    ])

    expect(sequence.stringify()).toBe(expected);
  });

  it("should not output to stringify for inferred participants i.e. those only declard within an event",function(){
    var expected = '"A"->"B": "Hello"';

    var sequence = Sequence([
      Event(Participant("A"),"->",Participant("B"),"Hello")
    ])

    expect(sequence.stringify()).toBe(expected);
  });

  it("should build a list of inferred participants for those actors declared only within an event",function(){
    var expected = 'participant "A"\r\nparticipant "B"';

    var sequence = Sequence([
      Event(Participant("A"),"->",Participant("B"),"Hello")
    ])

    //Note the use of the static Sequence.stringify!
    expect(Sequence.stringify(sequence.inferredParticipants())).toBe(expected);
  });

  it("should replace an inferred participant with an explicitly declared one if the alias matches the actor name",function(){
    var expected = 'participant "Very Long Name" as "A"\r\nparticipant "B"';

    var sequence = Sequence([
      Participant("Very Long Name","A"),
      Event(Participant("A"),"->",Participant("B"),"Hello")
    ])

    //Note the use of the static Sequence.stringify!
    expect(Sequence.stringify(sequence.participants())).toBe(expected);
  });

  it("should have explicitly declared participants take precidence over inferred participants even if they appear before the explicit participant",function(){
    var expected = 'participant "Very Long Name" as "A"\r\nparticipant "B"';

    var sequence = Sequence([
      Event(Participant("A"),"->",Participant("B"),"Hello"),
      Participant("Very Long Name","A")
    ])

    //Note the use of the static Sequence.stringify!
    expect(Sequence.stringify(sequence.participants())).toBe(expected);
  });
});
