var format = require('string-format');

var Participant = function(participant,alias){
  this.participant = participant;
  this.alias = alias;
};

Participant.prototype.tag = function(){
  return "participant";
}

Participant.prototype.stringify = function(){
  if(this.alias){
    return format('{tag} "{participant}" as "{alias}"',this);
  }

  return format('{tag} "{participant}"',this);
}

module.exports = function(){
  var ret = Object.create(Participant.prototype);
  Participant.apply(ret,arguments);
  
  return ret;
};
