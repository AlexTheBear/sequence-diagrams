var Sequence = require("../main.js");
var SequenceRender = require("./sequence-render.js");

var Render = function(){
  this.init();
}

Render.prototype.init = function(){
  this.sequenceRender = new SequenceRender('render');

  var _this = this;

  $('textarea').on('input',function(e){
    _this.refresh();
  });
}

Render.prototype.refresh = function(){
  var input = this.textArea().val();

  try{
    var sequence = Sequence(input);

    this.sequenceRender.update(sequence);

    this.error(false)
  }
  catch(e){
    console.error(e);
    this.error(true);
  }
}

Render.prototype.textArea = function(){
  if(!this._textArea){
    this._textArea = $('textarea');
  }

  return this._textArea;
}

Render.prototype.error = function(error){
  if(!error){
    //this.textArea().addClass('bg-danger');
    this.textArea().css('background-color','');
  }
  else{
    //this.textArea().removeClass('bg-danger');
    this.textArea().css('background-color','#f2dede');
  }
}

$.ready(new Render());
