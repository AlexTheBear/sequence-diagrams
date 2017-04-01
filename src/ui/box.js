var Fabric = require('fabric');
var Fs = require('fs');
var Box = undefined;

try{
  Box = require('./images/actor.svg');
}catch(e){
  Box = Fs.readFileSync('./src/ui/images/actor.svg','UTF-8');
}

var BODGE = null;

Fabric.loadSVGFromString(Box,function(objects,options){
  var obj = Fabric.util.groupSVGElements(objects, options);

  BODGE = obj;
  console.log("Loaded SVG");
});

var Box = function(text,options){
  options = options || {
    padding: 10,
    fontSize: 20
  };

  this.options(options);
  this.text(text);

  this.init();
}

Box.prototype.init = function(){
  var padding = this.options().padding;
  var text = new Fabric.Text( this.text(),
                              {fontSize: this.options().fontSize,top:padding,left:padding});

  var textWidth = text.getWidth();
  var textHeight = text.getHeight();

  var width = 2*padding+textWidth;
  var height = 2*padding+textHeight;

  this._minimumDimensions = {width:width,height:height};
  this._textRender = text;
}

Box.prototype.box = function(width,height){
  var obj = Fabric.util.object.clone(BODGE);

  var scaleX = width/obj.getWidth();
  var scaleY = height/obj.getHeight();

  obj.setScaleX(scaleX);
  obj.setScaleY(scaleY);

  obj.setLeft(0);
  obj.setTop(0);

  return obj;
}

Box.prototype._updateLayout = function(){
  var width = this.minimumDimensions().width;
  var height = this.minimumDimensions().height;

  this._group = new Fabric.Group([ this.box(width,height), this._textRender ]);

  this._group.setLeft(this.dimensions().left);
  this._group.setTop(this.dimensions().top);
}

Box.prototype.dimensions = function(dimensions){
  if(dimensions){
    this._dimensions = dimensions;

    this._updateLayout();
  }

  return this._dimensions?this._dimensions:this.minimumDimensions();
}

Box.prototype.options = function(options){
  if(options){
    this._options = options;
  }

  return this._options;
}

Box.prototype.text = function(text){
  if(text){
    this._text = text;
  }

  return this._text;
}

Box.prototype.renderObject = function(){
  return this._group;
}

Box.prototype.minimumDimensions = function(){
  return this._minimumDimensions;
}

module.exports = function(){
  var ret = Object.create(Box.prototype);
  Box.apply(ret,arguments);

  return ret;
};
module.exports.prototype = Box.prototype;
