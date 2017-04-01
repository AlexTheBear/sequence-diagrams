var Fabric = require('fabric');
var Fs = require('fs');
var ArrowUtil = require('./arrow.js')

var EventLine = function(event,options){
  options = options || {
    text: {
      fontSize: 20
    },
    arrow: {
      stoke: 'red',
      width: 10,
      height: 10,
      loopback: {
        gap: 20,
        width: 30
      }
    }
  };

  this.options(options);
  this.event(event);

  this.init();
}

EventLine.prototype.init = function(){
  if(this.isLoopbackType()){
    this.initLoopbackLine();
  }
  else{
    this.initStraightLine();
  }
}

EventLine.prototype.initStraightLine = function(){
  var options = this.options();

  var arrowWidth = options.arrow.width;
  var arrowHeight = options.arrow.height;

  var text = new Fabric.Text( this.event().message,
                              {fontSize: options.text.fontSize});

  var textWidth = text.getWidth();
  var textHeight = text.getHeight();

  var totalWidth = 2*arrowWidth+textWidth;
  var totalHeight = Math.max(textHeight,arrowHeight)+arrowHeight;

  var textBaseline = Math.max(textHeight,arrowHeight);

  text.top = textBaseline-textHeight;

  var group = new Fabric.Group([ text ]);

  this._minimumDimensions = {width: totalWidth, height: totalHeight};

  this._text = text;
  this._group = group;
}

EventLine.prototype.initLoopbackLine = function(){
  var options = this.options();

  var arrowWidth = options.arrow.width;
  var arrowHeight = options.arrow.height;

  var text = new Fabric.Text( this.event().message,
                              {fontSize: options.text.fontSize});

  var textWidth = text.getWidth();
  var textHeight = text.getHeight();

  var line = ArrowUtil().loopback(arrowWidth,2*arrowHeight,this.event().type);

  var textBaseline = /*Math.max(textHeight,*/line.getHeight()/2;//);

  text.top = textBaseline-textHeight/2;
  text.left = line.getWidth();

  var group = new Fabric.Group([ text, line ]);

  var totalHeight = Math.max(textHeight,line.getHeight());

  this._minimumDimensions = {width: textWidth+line.getWidth(), height: totalHeight};

  this._text = text;
  this._group = group;
}

EventLine.prototype.isLoopbackType = function(){
  return this.event().left===this.event().right;
}

EventLine.prototype.renderObject = function(){
  return this._group;
}

EventLine.prototype.minimumDimensions = function(){
  return this._minimumDimensions;
}

EventLine.prototype._updateLayout = function(){
  var dimensions = this.dimensions();

  var minWidth = this.minimumDimensions().width;
  var height = this.minimumDimensions().height;
  var width = dimensions.width;
  var left = dimensions.left;
  var top = dimensions.top;

  var widthDiff = width-minWidth;

  if(this.isLoopbackType()){
    this._group.setLeft(left);
    this._group.setTop(top);

    return;
  }

  /*
  * Fabric Groups have quirly behaviour, the bits below make
  * it work but I can't really say I get why
  */
  this._group.removeWithUpdate(this._text);

  this._text.left = this.options().arrow.width+(width-minWidth)/2;

  //
  this._group.addWithUpdate(this.createArrow());
  this._group.addWithUpdate(this._text);

  this._group.setWidth(width);
  this._group.setLeft(left);
  this._group.setTop(top);
}

EventLine.prototype.createArrow = function(){
  var obj = ArrowUtil().straight(this.dimensions().width,this.options().arrow.width,2*this.options().arrow.height,this.event().type);

  obj.setLeft(0);
  obj.setTop(this.minimumDimensions().height-2*this.options().arrow.height);

  return obj;
}

EventLine.prototype.dimensions = function(dimensions){
  if(dimensions){
    this._dimensions = dimensions;

    this._updateLayout();
  }

  return this._dimensions?this._dimensions:this.minimumDimensions();
}

EventLine.prototype.options = function(options){
  if(options){
    this._options = options;
  }

  return this._options;
}

EventLine.prototype.event = function(event){
  if(event){
    this._event = event;
  }

  return this._event;
}

module.exports = function(){
  var ret = Object.create(EventLine.prototype);
  EventLine.apply(ret,arguments);

  return ret;
};
module.exports.prototype = EventLine.prototype;
