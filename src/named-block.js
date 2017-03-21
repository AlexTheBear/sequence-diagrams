var format = require('string-format');

var NamedBlock = function(name,statements){
  this.name = name;
  this.statements(statements||[]);
};

NamedBlock.prototype.statements = function(statements){
  if(statements){
    this._statements = statements;
  }

  return this._statements;
}

NamedBlock.prototype.stringify = function(){
  var ret = [format('"{name}"',this)];

  this.statements().forEach(function(statement){
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
module.exports.prototype=NamedBlock.prototype;
