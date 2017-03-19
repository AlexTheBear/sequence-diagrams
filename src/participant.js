var format = require('string-format');

var Participant = function(participant,alias,inferred){
  this.participant(participant);
  this.alias(alias);
  this.inferred(false);
};

Participant.prototype.participant = function(participant){
  if(participant){
    this._participant = participant;
  }

  return this._participant;
}

Participant.prototype.alias = function(alias){
  if(alias){
    this._alias = alias;
  }

  return this._alias;
}

Participant.prototype.inferred = function(inferred){
  if(arguments.length>0){
    this._inferred = inferred;
  }

  return this._inferred;
}

Participant.prototype.shortName = function(){
  if(this.alias()){
    return this.alias();
  }

  return this.participant();
}

Participant.prototype.tag = function(){
  return "participant";
}

Participant.prototype.stringify = function(){
  if(this.alias()){
    return format('{tag} "{participant}" as "{alias}"',this);
  }

  return format('{tag} "{participant}"',this);
}

module.exports = function(){
  var ret = Object.create(Participant.prototype);
  Participant.apply(ret,arguments);

  return ret;
};
module.exports.prototype = Participant.prototype;
