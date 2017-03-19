var format = require('string-format');

var Alternative = function(blocks){
  this._blocks = blocks||[];
};

Alternative.prototype.blocks = function(){
  return this._blocks;
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
  var ret = [];

  this.blocks().forEach(function(block,indx){
    var tag = (indx===0 ? this.startTag() : this.elseTag());

    ret.push( format('{0} {1}',tag,block.stringify()) );
  },this);

  ret.push(format(this.endTag()));

  return ret.join('\r\n');
}

module.exports = function(){
  var ret = Object.create(Alternative.prototype);
  Alternative.apply(ret,arguments);

  return ret;
};
module.exports.prototype=Alternative.prototype;
