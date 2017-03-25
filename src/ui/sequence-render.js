var Fabric = require('fabric');

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
    var text = this.text(participant.participant(),{
      top: layout.participants[index].top,
      left: layout.participants[index].left
    })

    this.canvas.add(text);
  },this);

  sequence.statements().forEach(function(statement,index){
    var text = this.text(statement.message,{
      top: layout.statements[index].top,
      left: layout.statements[index].left
    });
    this.canvas.add(text);
  },this)
}

SequenceRender.prototype.relayout = function(){
  this.layout({});
  this.layoutVertical();
  this.layoutHorizontal();

  console.log(this.layout());
}

SequenceRender.prototype.layoutVertical = function(){
  var sequence = this.sequence();
  var layout = this.layout();

  var currentY = 0;

  if(sequence.title()){
    var dimensions = this.dimensions(this.text(sequence.title().title));

    layout.title = {
      top: 0,
      left: 0,
      width: dimensions.width,
      height: dimensions.height
    }

    currentY += dimensions.height;
  }

  layout.participants = [];

  if(sequence.participants().length>0){
      var maxHeight = 0;

      if(currentY>0){
        currentY += this.options().linePadding;
      }

      sequence.participants().forEach(function(participant){
        var dimensions = this.dimensions(this.text(participant.participant()));

        layout.participants.push({
          top: currentY,
          left: 0,
          width: dimensions.width,
          height: dimensions.height
        });

        maxHeight = Math.max(dimensions.height,maxHeight);
      },this);

      currentY += maxHeight;
  }

  layout.statements = [];

  if(sequence.statements().length>0){
    sequence.statements().forEach(function(statement){
      currentY += this.options().linePadding;

      var dimensions = this.dimensions(this.text(statement.message));

      layout.statements.push({
        top: currentY,
        left: 0,
        width: dimensions.width,
        height: dimensions.height
      });

      currentY += dimensions.height;
    },this);
  }

  layout.height = currentY;

  this.layout(layout);
}

SequenceRender.prototype.layoutHorizontal = function(){
  var sequence = this.sequence();
  var layout = this.layout();

  var participants = sequence.participants();
  var statements = sequence.statements();
  var defWidths = [];

  var currentX = 0;

  /*
  * First find 'natural' positions, ignoring event lines.
  * Based purley on label width for a participant
  */
  participants.forEach(function(participant,indx){
    var dimensions = this.dimensions(this.text(participant.participant()));

    layout.participants[indx].left = currentX;
    layout.participants[indx].middle = currentX+dimensions.width*0.5;

    if(indx+1!==participants.length){
      currentX += this.options().participantPadding;
    }
    currentX += dimensions.width;
  },this);

  /*
  * Formulate matrix of all width(s for event line where (An->Am) with n!=m
  *     A     B       C
  *A    0   W(A->B)   W(A->C)
  *B          0       W(B->C)
  *C                  0
  */
  var matrix = this.matrix(participants.length,0);

  statements.forEach(function(statement,indx){
    var left = statement.left;
    var right = statement.right;

    var dimensions = this.dimensions(this.text(statement.message));

    if(left!==right){
      if(participants.indexOf(left)>participants.indexOf(right)){
        var temp = left;
        left = right;
        right = temp;
      }
      var indexLeft = participants.indexOf(left);
      var indexRight = participants.indexOf(right);

      var currMax = matrix[indexLeft][indexRight];

      matrix[indexLeft][indexRight] = Math.max(currMax,dimensions.width);
    }
  },this);

  console.log('-----------------');
  for(var i=0;i<matrix.length;i++){
    console.log(matrix[i]);
  }
  /*
  * Accumulate path and find max gap from first participant
  *     A     B       C
  *A    0   W(A->B)   Math.max(W(A->C),W(A->B)+W(B->C))
  *B          0       W(B->C)
  *C                  0
  */
  for(var i=1;i<matrix.length;i++){
    var currentVal = matrix[0][i];
    var accumulate = 0;

    for(var j=1; j<=i; j++ ){
      accumulate += matrix[j-1][j];
    }

    console.log('c='+currentVal+', a='+accumulate);

    matrix[0][i] = Math.max(currentVal,accumulate);
  }

  console.log('-----------------');
  for(var i=0;i<matrix.length;i++){
    console.log(matrix[i]);
  }
  console.log('-----------------');
  /*
  * Final layout calculation: matrix is now based
  * on distance from first participant so compare to
  * current 'natural' distance (based on purely participant
  * label length) and choose whichever is the larger
  */
  var eventDistances = matrix[0]?matrix[0]:[];

  var origin = layout.participants.length>0?layout.participants[0].middle:0;
  var absoluteDistances = [origin];
  for(var i=1;i < eventDistances.length;i++){
    var eventDistance = eventDistances[i];
    var naturalDistance = layout.participants[i].middle-origin;

    absoluteDistances.push(origin+Math.max(eventDistance,naturalDistance));
  }
  /*
  * We now have the layout so apply to all participants
  * and statements
  */
  layout.participants.forEach(function(participant,index){
    participant.middle = absoluteDistances[index];
    participant.left = participant.middle-participant.width/2;

    currentX = Math.max(currentX,participant.left+participant.width);
  });

  sequence.statements().forEach(function(statement,index){
    var leftParticipantIndex = Math.min(participants.indexOf(statement.left),participants.indexOf(statement.right));
    var rightParticipantIndex = Math.max(participants.indexOf(statement.left),participants.indexOf(statement.right));

    layout.statements[index].left = absoluteDistances[leftParticipantIndex];
    layout.statements[index].width = absoluteDistances[rightParticipantIndex]-absoluteDistances[leftParticipantIndex];
  });


  currentX = Math.max(currentX,layout.title?layout.title.width:0);

  layout.width = currentX;

  if(layout.title){
    layout.title.left = (currentX-layout.title.width)/2;
  }

  console.log('-----------------');
  console.log(layout);
  console.log('-----------------');
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
