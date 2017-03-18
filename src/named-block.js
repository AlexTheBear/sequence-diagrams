var format = require('string-format');

var NamedBlock = function(name,block){
  this.name = name;
  this.block = block;
};

NamedBlock.prototype.stringify = function(){
  var ret = [format('"{name}"',this)];
  
  this.block.forEach(function(statement){
    ret.push(this.indent(statement.stringify()));
  },this);

  return ret.join('\r\n');
}

NamedBlock.prototype.indent = function(str){
  var ret = [];
  var strs = str.split('\r\n');

  strs.forEach(function(str){
    ret.push(format('{0}{1}','\t',str));
  });

  return ret.join('\r\n');
}

module.exports = function(){
  var ret = Object.create(NamedBlock.prototype);
  NamedBlock.apply(ret,arguments);

  return ret;
};
