var fs = require('fs');
var jison = require('jison');
var sequence = require('../src/sequence.js');

var grammar = fs.readFileSync('./src/grammars/web-sequence-diagrams.jison','UTF-8');

module.exports = function(){
  var parser = new jison.Parser(grammar);

  parser.yy = sequence();
  parser.yy.parseError = function(message, hash) {
      console.log(message);
      console.log(hash|{});
  };

  parser.generate();

  return function(input){
    return parser.parse(input);
  }
};
