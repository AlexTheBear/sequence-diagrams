var format = require('string-format');

var Alternative = function(){
  this.blocks = [];
};

Alternative.prototype.addBlock = function(block){
  this.blocks.push(block);
}

Alternative.prototype.startTag = function(){
  return 'alt';
}

Alternative.prototype.elseTag = function(){
  return 'else';
}

Alternative.prototype.endTag = function(){
  return 'end';
}

Alternative.prototype.stringify = function(){
  return format('',this);
}

module.exports = function(){
  var ret = Object.create(Alternative.prototype);
  Alternative.apply(ret,arguments);

  return ret;
};
