var format = require('string-format');

var Event = function(left,type,right,message){
  this.left = left;
  this.right = right;
  this.type = type;
  this.message = message;
};

Event.prototype.stringify = function(){
  return format('"{left.shortName}"{stringifyType}"{right.shortName}": "{message}"',this);
}

Event.prototype.stringifyType = function(){
  return format('{type.arrowLeft}{type.lineType}{type.arrowRight}{type.createActor}{type.activate}',this);
}

module.exports = function(){
  var ret = Object.create(Event.prototype);
  Event.apply(ret,arguments);

  return ret;
};
module.exports.prototype = Event.prototype;
module.exports.NONE = '';
module.exports.ARROW_LEFT_OPEN = '<<';
module.exports.ARROW_LEFT_CLOSED = '<';
module.exports.LINE_SOLID = '-';
module.exports.LINE_DASHED = '--';
module.exports.ARROW_RIGHT_OPEN = '>>';
module.exports.ARROW_RIGHT_CLOSED = '>';
module.exports.CREATOR = '*';
module.exports.ACTIVATOR = '+';
module.exports.DEACTIVATOR = '-';
