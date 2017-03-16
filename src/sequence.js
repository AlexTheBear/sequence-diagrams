var Title = require('../src/title.js');
var Participant = require('../src/participant.js');
var Event = require('../src/event.js');
var AutoNumber = require('../src/auto-number.js');

var Sequence = function(){
  this._participants = [];
  this._events = [];
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

Sequence.prototype.autoNumberOn = function(startNumber){
  this._events.push(new AutoNumber(startNumber));
}

Sequence.prototype.autoNumberOff = function(startNumber){
  this._events.push(new AutoNumber());
}

Sequence.prototype.addEvent = function(leftActor,type,rightActor,message){
  this._events.push(new Event(leftActor,type,rightActor,message));
}

Sequence.prototype.events = function(){
  return this._events;
}

Sequence.prototype.stringify = function(){
  var ret = [];

  if(this.title()){
    ret.push(this.title().stringify());
  }

  this.participants().forEach(function(participant){
    ret.push(participant.stringify());
  });

  this.events().forEach(function(event){
    ret.push(event.stringify());
  });

  return ret.join('\r\n');
}

module.exports = function(){
  return new Sequence();
}
