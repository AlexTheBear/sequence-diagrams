var format = require('string-format');

var Title = function(title){
  this.title = title;
};

Title.prototype.tag = function(){
  return "title";
}

Title.prototype.stringify = function(){
  return format('{tag} "{title}"',this);
}

module.exports = function(title){return new Title(title);};
