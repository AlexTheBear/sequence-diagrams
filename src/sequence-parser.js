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
var Grammar = undefined;

try{
  Grammar = require('./grammars/web-sequence-diagrams.jison');
}catch(e){
  Grammar = fs.readFileSync('./src/grammars/web-sequence-diagrams.jison','UTF-8');
}

module.exports = function(){
  var parser = new jison.Parser(Grammar);

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

  var source = parser.generate();

  //fs.writeFileSync('./web-parser.js',source);

  return function(input){
    var ret = parser.parse(input);

    ret.stringify = function(){
      return Sequence.stringify(this);
    }

    return ret;
  }
};
