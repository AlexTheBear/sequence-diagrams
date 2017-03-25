var format = require('string-format');

var AutoNumber = function(startNumber){
  this.startNumber = startNumber;
};

AutoNumber.prototype.tag = function(){
  return "autonumber";
}

AutoNumber.prototype.stringify = function(){
  if(this.startNumber){
    return format('{tag} {startNumber}',this);
  }

  return format('{tag} off',this);
}

module.exports = function(number){return new AutoNumber(number);};
