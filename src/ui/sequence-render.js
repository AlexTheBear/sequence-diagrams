var Fabric = require('fabric');
var EventLine = require('./event-line.js');
var Box = require('./box.js');

function SequenceRender(canvasSelector,options){
  this.canvas = new Fabric.Canvas(canvasSelector);
  this.layout({});
  this.width(0);
  this.height(0);

  options = options || {
    participantPadding: 10,
    linePadding: 10
  };

  this.options(options);
}

SequenceRender.prototype.update = function(sequence){
  this.canvas.clear();

  this.sequence(sequence);

  this.relayout();
  this.redraw();
}

SequenceRender.prototype.redraw = function(){
  var sequence = this.sequence();
  var layout = this.layout();

  if(sequence.title()){
    var text = this.text(sequence.title().title,{
      left: layout.title.left,
      top: layout.title.top
    });

    this.canvas.add(text);
  }

  sequence.participants().forEach(function(participant,index){
    var left = layout.participants[index].left;
    var top = layout.participants[index].top;
    var bottomOfLabel = top+layout.participants[index].height;
    var middle = layout.participants[index].middle;

    var item = layout.participants[index].item;
    item.dimensions({top:top,left:left});

    var line = new Fabric.Line([middle,bottomOfLabel,middle,layout.height],{stroke:'gray',strokeDashArray:[4,2,1,2]});

    this.canvas.add(item.renderObject());
    this.canvas.add(line);
  },this);

  sequence.statements().forEach(function(statement,index){
    var top = layout.statements[index].top;
    var left = layout.statements[index].left;
    var width = layout.statements[index].width;

    var eventLine = layout.statements[index].item;

    eventLine.dimensions({left:left,top:top,width:width});

    this.canvas.add(eventLine.renderObject());
  },this)
}

SequenceRender.prototype.relayout = function(){
  this.layout(this.createLayout());
  this.layoutVertical();
  this.layoutHorizontal();
}

SequenceRender.prototype.createLayout = function(){
  var layout = {};

  var sequence = this.sequence();

  if(sequence.title()){
    var item = this.text(sequence.title().title);
    var dimensions = this.dimensions(item);

    layout.title = {
      top: 0,
      left: 0,
      width: dimensions.width,
      height: dimensions.height,
      item: item
    };
  }

  layout.participants = [];

  sequence.participants().forEach(function(participant){
    var item = Box(participant.participant(),this.options().participant);
    var dimensions = item.minimumDimensions();

    layout.participants.push({
      top: 0,
      left: 0,
      width: dimensions.width,
      height: dimensions.height,
      item: item
    });
  },this);

  layout.statements = [];

  sequence.statements().forEach(function(statement){
    var item = this.createRenderItemForStatement(statement);
    var dimensions = item.minimumDimensions();

    layout.statements.push({
      top: 0,
      left: 0,
      width: dimensions.width,
      height: dimensions.height,
      item: item
    });
  },this);

  return layout;
}

SequenceRender.prototype.createRenderItemForStatement = function(statement){
  return EventLine(statement,this.options().eventLine);
}

SequenceRender.prototype.layoutVertical = function(){
  var sequence = this.sequence();
  var layout = this.layout();

  var currentY = 0;

  currentY = this.layoutTitleVertically(currentY);

  currentY = this.layoutParticipantsVertically(currentY);

  currentY = this.layoutStatementsVertically(currentY);

  layout.height = currentY;
}

SequenceRender.prototype.layoutTitleVertically = function(currentY){
  var layout = this.layout();
  var sequence = this.sequence();

  if(sequence.title()){
    currentY += layout.title.height;
  }

  return currentY;
}

SequenceRender.prototype.layoutParticipantsVertically = function(currentY){
  var layout = this.layout();
  var sequence = this.sequence();

  var maxHeight = 0;

  if(currentY>0 && sequence.participants().length>0){
    currentY += this.options().linePadding;
  }

  sequence.participants().forEach(function(participant,index){
    layout.participants[index].top = currentY;

    maxHeight = Math.max(layout.participants[index].height,maxHeight);
  },this);

  currentY += maxHeight;

  return currentY;
}

SequenceRender.prototype.layoutStatementsVertically = function(currentY){
  var layout = this.layout();
  var sequence = this.sequence();

  sequence.statements().forEach(function(statement,index){
    currentY += this.options().linePadding;

    layout.statements[index].top = currentY;

    currentY += layout.statements[index].height;
  },this);

  return currentY;
}

SequenceRender.prototype.layoutHorizontal = function(){
  var currentX = 0;

  currentX = this.layoutParticipantsIgnoringEventsHorizontally();

  var matrix = this.formulateMatrixOfEventWidths();

  var eventHorizontalPositions = this.formulateOptimalPositionsForEvents(matrix);

  currentX = this.applyHorizontalPositionsToLayout(eventHorizontalPositions,currentX);

  currentX = this.layoutTitleHorizontally(currentX);

  this.layout().width = currentX;
}

SequenceRender.prototype.layoutTitleHorizontally = function(currentX){
  var layout = this.layout();

  currentX = Math.max(currentX,layout.title?layout.title.width:0);

  if(layout.title){
    layout.title.left = (currentX-layout.title.width)/2;
  }

  return currentX;
}

/*
* First find 'natural' positions, ignoring event lines.
* Based purley on label width for a participant
*/
SequenceRender.prototype.layoutParticipantsIgnoringEventsHorizontally = function(){
  var layout = this.layout();
  var participants = this.sequence().participants();

  var currentX = 0;

  participants.forEach(function(participant,index){
    var layoutItem = layout.participants[index];

    layoutItem.left = currentX;
    layoutItem.middle = currentX+layoutItem.width*0.5;

    if(index+1!==participants.length){
      currentX += this.options().participantPadding;
    }
    currentX += layoutItem.width;
  },this);

  return currentX;
}

SequenceRender.prototype.formulateMatrixOfEventWidths = function(){
  /*
  * Formulate matrix of all width(s for event line where (An->Am) with n!=m
  *     A     B       C
  *A    0   W(A->B)   W(A->C)
  *B          0       W(B->C)
  *C                  0
  */
  var participants = this.sequence().participants();
  var statements = this.sequence().statements();
  var layout = this.layout();

  var matrix = this.matrix(participants.length,0);

  statements.forEach(function(statement,index){
    var layoutItem = layout.statements[index];

    var left = statement.left;
    var right = statement.right;

    if(left!==right){
      if(participants.indexOf(left)>participants.indexOf(right)){
        var temp = left;
        left = right;
        right = temp;
      }
      var indexLeft = participants.indexOf(left);
      var indexRight = participants.indexOf(right);

      var currMax = matrix[indexLeft][indexRight];

      matrix[indexLeft][indexRight] = Math.max(currMax,layoutItem.width);
    }
    else{
      var index = participants.indexOf(left);

      if(index+1<matrix.length){
        var currMax = matrix[index][index+1];

        matrix[index][index+1] = Math.max(currMax,layoutItem.width);
      }
    }
  },this);

  /*
  * matrix is now the gap between all (An->Am) but does
  * not take account of 'natural' gap between participants
  * we compare natural width An->An+1 with event based
  * width for the same pair and choose whichever is the
  * larger
  */
  for( var i=1; i<matrix.length; i++ ){
    var naturalGap = layout.participants[i].middle-layout.participants[i-1].middle;
    var eventGap = matrix[i-1][i];

    matrix[i-1][i] = Math.max(naturalGap,eventGap);
  }

  return matrix;
}

SequenceRender.prototype.formulateOptimalPositionsForEvents = function(matrix){
  var layout = this.layout();

  /*
  * Accumulate path and find max gap from first participant
  *     A     B       C
  *A    0   W(A->B)   Math.max(W(A->C),W(A->B)+W(B->C))
  *B          0       W(B->C)
  *C                  0
  */
  for(var i=1;i<matrix.length;i++){
    var max = 0;

    for(var row=0; row<i;row++){
      var upto = matrix[0][row];
      var val = matrix[row][i];
      var sum = upto+val;

      max = Math.max(max, sum);
    }

    matrix[0][i] = max;
  }

  var accountForFirstParticipant = layout.participants.length>0?layout.participants[0].middle:0;
  for(var i=0;i<matrix.length;i++){
    matrix[0][i] = matrix[0][i]+accountForFirstParticipant;
  }

  return matrix[0];
}

SequenceRender.prototype.applyHorizontalPositionsToLayout = function(positions,currentX){
  var layout = this.layout();
  var sequence = this.sequence();
  var participants = sequence.participants();

  layout.participants.forEach(function(participant,index){
    participant.middle = positions[index];
    participant.left = participant.middle-participant.width/2;

    currentX = Math.max(currentX,participant.left+participant.width);
  });

  sequence.statements().forEach(function(statement,index){
    var leftParticipantIndex = Math.min(participants.indexOf(statement.left),participants.indexOf(statement.right));
    var rightParticipantIndex = Math.max(participants.indexOf(statement.left),participants.indexOf(statement.right));

    layout.statements[index].left = positions[leftParticipantIndex];

    //Only set width for non-loopback events
    if(rightParticipantIndex!=leftParticipantIndex){
      layout.statements[index].width = positions[rightParticipantIndex]-positions[leftParticipantIndex];
    }

    currentX = Math.max(currentX,layout.statements[index].left+layout.statements[index].width);
  });

  return currentX;
}

SequenceRender.prototype.matrix = function(size,val){
  var matrix = [];
  for(var i=0;i<size;i++){
    var col = [];
    for(var j=0;j<size;j++){
      col.push(val);
    }
    matrix.push(col);
  }

  return matrix;
}

SequenceRender.prototype.sequence = function(sequence){
  if(sequence){
    this._sequence = sequence;
  }

  return this._sequence;
}

SequenceRender.prototype.layout = function(layout){
  if(layout){
    this._layout = layout;
  }

  return this._layout;
}

SequenceRender.prototype.dimensions = function(obj){
  return {
    width: obj.getWidth(),
    height: obj.getHeight()
  }
}

SequenceRender.prototype.canvasSize = function(width,height){
  this.canvas.setWidth( width );
  this.canvas.setHeight( height );
  this.canvas.calcOffset();
}

SequenceRender.prototype.text = function(text,options){
  options = options||{};
  options.fontSize = 20;

  return new Fabric.Text(text,options);
}

SequenceRender.prototype.options = function(options){
  if(options){
    this._options = options;
  }

  return this._options;
}

SequenceRender.prototype.width = function(width){
  return this.layout().width;
}

SequenceRender.prototype.height = function(height){
  return this.layout().height;
}

module.exports = function(canvasSelector,options){
  return new SequenceRender(canvasSelector,options);
}
