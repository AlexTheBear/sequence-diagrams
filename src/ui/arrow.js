var Fabric = require('fabric');
var Fs = require('fs');
var Event = require('../event.js');
var ArrowClosed = undefined;

try{
  ArrowClosed = require('./images/closed-arrow-head.svg');
}catch(e){
  ArrowClosed = Fs.readFileSync('./src/ui/images/closed-arrow-head.svg','UTF-8');
}

var ArrowOpen = undefined;

try{
  ArrowOpen = require('./images/open-arrow-head.svg');
}catch(e){
  ArrowOpen = Fs.readFileSync('./src/ui/images/open-arrow-head.svg','UTF-8');
}

var Arrow = function(){
  return {
    straight: function(width,arrowWidth,arrowHeight,type){
      var group = [];

      if(this._hasLeftArrow(type)){
        group.push(this._arrow(width,arrowWidth,arrowHeight,false,type.arrowLeft===Event.ARROW_LEFT_OPEN?Arrow.open:Arrow.closed));
      }
      if(this._hasRightArrow(type)){
        group.push(this._arrow(width,arrowWidth,arrowHeight,true,type.arrowRight===Event.ARROW_RIGHT_OPEN?Arrow.open:Arrow.closed));
      }

      group.push(this._line(width,arrowWidth,arrowHeight,type,Arrow.open));

      return new Fabric.Group(group);
    },

    loopback: function(arrowWidth,arrowHeight,type){
      var group = [];

      if(this._hasLeftArrow(type)){
        group.push(this._arrow(0,arrowWidth,arrowHeight,false,type.arrowLeft===Event.ARROW_LEFT_OPEN?Arrow.open:Arrow.closed));
      }
      if(this._hasRightArrow(type)){
        var arrow = this._arrow(0,arrowWidth,arrowHeight,false,type.arrowRight===Event.ARROW_RIGHT_OPEN?Arrow.open:Arrow.closed);
      }

      arrow.setTop(2*arrowHeight);
      group.push(arrow);
      group.push(this._curve(arrowWidth,arrowHeight,type,Arrow.closed));

      return new Fabric.Group(group);
    },

    _hasLeftArrow: function(type){
      return type.arrowLeft!==Event.NONE;
    },

    _hasRightArrow: function(type){
      return type.arrowRight!==Event.NONE;
    },

    _hasDashStyle: function(type){
      return type.lineType===Event.LINE_DASHED;
    },

    _curve: function(arrowWidth,arrowHeight,type,arrow){
      var x1 = arrowWidth*(1-arrow.connectPoint.overlapRatioX);
      var x1Org = x1;
      if(!this._hasLeftArrow(type)){
        x1 = 0;
      }

      var y1 = arrowHeight*arrow.connectPoint.overlapRatioY;

      var y2 = 2*arrowHeight;

      var options = {
        fill:'',
        stroke:'black'
      };

      if(this._hasDashStyle(type)){
        options.strokeDashArray = [2, 2]
      }

      return new Fabric.Path('M'+x1+' '+y1+' c 30 0, 30 '+y2+', '+(this._hasLeftArrow(type)?0:x1Org)+' '+y2,options);
    },

    _line: function(width,arrowWidth,arrowHeight,type,arrow){
      var x1 = this._hasLeftArrow(type)?(1-arrow.connectPoint.overlapRatioX)*arrowWidth:0;
      var x2 = width-(1-arrow.connectPoint.overlapRatioX)*arrowWidth;

      var options = {
        stroke:'black'
      };

      if(this._hasDashStyle(type)){
        options.strokeDashArray = [2, 2]
      }

      var line = new Fabric.Line( [x1,0,x2,0],options);

      line.setTop(arrow.connectPoint.overlapRatioY*arrowHeight);

      return line;
    },

    _arrow: function(totalWidth,width,height,right,arrow){
      var arrow = Fabric.util.object.clone(arrow.shape);

      if(!right){
        arrow.set({flipX:true});
      }

      var scaleX = (width)/arrow.getWidth();
      var scaleY = (height)/arrow.getHeight();

      arrow.setScaleX(scaleX);
      arrow.setScaleY(scaleY);

      arrow.setLeft(right?totalWidth-width:0);
      arrow.setTop(0);

      return arrow;
    }
  }
}

function init(){
  loadSVG(ArrowClosed,setClosedArrow);
  loadSVG(ArrowOpen,setOpenArrow);
}

function setClosedArrow(shape,connectPoint){
  Arrow.closed = {
    shape: shape,
    connectPoint: connectPoint
  }
}

function setOpenArrow(shape,connectPoint){
  Arrow.open = {
    shape: shape,
    connectPoint: connectPoint
  }
}

function loadSVG(svgString,callback){
  Fabric.loadSVGFromString(svgString,function(svg,options){
    var connectPoint = findConnectionPoint(svg);

    var arrow = Fabric.util.groupSVGElements(svg,options);

    callback(arrow,connectPoint);
  });
}

function findConnectionPoint(svg){
  var connectPoint = svg.filter(isLine)[0];
  var nativeArrow = svg.filter(isArrow)[0];

  var arrowBoundingBox = nativeArrow.getBoundingRect();
  var lineBoundingBox = connectPoint.getBoundingRect();

  var overlapRatioX = Math.abs(arrowBoundingBox.left-lineBoundingBox.left)/arrowBoundingBox.width;
  var overlapRatioY = Math.abs(arrowBoundingBox.top-lineBoundingBox.top)/arrowBoundingBox.height;

  return {
    overlapRatioX: overlapRatioX,
    overlapRatioY: overlapRatioY
  }
}

function isLine(svgItem){
  return svgItem.id==='line';
}

function isArrow(id){
  return !isLine(id);
}

init();

module.exports = Arrow;
