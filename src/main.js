var Parser = require('../src/sequence-parser.js');
var Sequence  = require('../src/sequence.js');

module.exports = function(text){
  var statements = Parser()(text);

  return Sequence(statements);
};
