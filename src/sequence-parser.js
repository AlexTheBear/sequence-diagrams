var fs = require('fs');
var jison = require('jison');
var Sequence = require('../src/sequence.js');
var NamedBlock = require("../src/named-block.js");
var AutoNumber = require("../src/auto-number.js");
var Title = require("../src/title.js");
var Event = require("../src/event.js");
var Participant = require("../src/participant.js");
var Alternative = require("../src/alternative.js");
var NamedBlock = require("../src/named-block.js");

var grammar = fs.readFileSync('./src/grammars/web-sequence-diagrams.jison','UTF-8');

module.exports = function(){
  var parser = new jison.Parser(grammar);

  parser.yy = {
    sequence: Sequence,
    title: Title,
    namedBlock: NamedBlock,
    autoNumber: AutoNumber,
    participant: Participant,
    event: Event,
    alternative: Alternative,
    namedBlock: NamedBlock
  }
  parser.yy.parseError = function(message, hash) {
      console.log(message);
      console.log(hash||{});
  };

  parser.generate();

  return function(input){
    return parser.parse(input);
  }
};
