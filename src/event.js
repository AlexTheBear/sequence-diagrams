var format = require('string-format');

var Event = function(left,type,right,message){
  this.left = left;
  this.right = right;
  this.type = type;
  this.message = message;
};

Event.prototype.stringify = function(){
  return format('"{left}"{type}"{right}": "{message}"',this);
}

module.exports = function(){
  var ret = Object.create(Event.prototype);
  Event.apply(ret,arguments);

  return ret;
};
