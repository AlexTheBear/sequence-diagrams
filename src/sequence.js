var Title = require('../src/title.js');
var Participant = require('../src/participant.js');

var Sequence = function(){
  this._participants = [];
};

Sequence.prototype.title = function(){
  if(arguments.length==0) return this._title;

  this._title = Title(arguments[0]);
}

Sequence.prototype.addParticipant = function(name, alias){
  this._participants.push( new Participant(name, alias) );
}

Sequence.prototype.participants = function(){
  return this._participants;
}

Sequence.prototype.stringify = function(){
  var ret = [];

  if(this.title()){
    ret.push(this.title().stringify());
  }

  this.participants().forEach(function(participant){
    ret.push(participant.stringify());
  });

  return ret.join('\r\n');
}

module.exports = function(){
  return new Sequence();
}
