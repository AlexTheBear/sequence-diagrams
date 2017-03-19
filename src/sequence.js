var Title = require('../src/title.js');
var Participant = require('../src/participant.js');
var Event = require('../src/event.js');
var AutoNumber = require('../src/auto-number.js');
var Alternative = require('../src/alternative.js');
var Participant = require('../src/participant.js');

var Sequence = function(statements){
  this._statements = statements||[];

  this.init();
};

Sequence.prototype.init = function(){
  var titlesAndParticipants = this.removeTitlesAndParticipants();
  this.deduplicate(titlesAndParticipants);
}

Sequence.prototype.deduplicate = function(titlesAndParticipants){
  var title = titlesAndParticipants.titles.pop();

  if(title){
    this.title(title);
  }

  var participants = titlesAndParticipants.participants;
  var deduplicatedParticipants = [];
  var aliases = [];

  participants.forEach(function(participant){
    if(participant.inferred()){
      if(aliases.indexOf(participant.shortName())===-1){
        deduplicatedParticipants.push(participant);
      }
    }
    else if(!participant.alias()){
      deduplicatedParticipants.push(participant);
    }
    else if(aliases.indexOf(participant.alias())===-1){
      aliases.push(participant.alias());
      deduplicatedParticipants.push(participant);
    }
  },this);

  this.participants(deduplicatedParticipants);
}

Sequence.prototype.removeTitlesAndParticipants = function(){
  var titles = [];
  var participants = [];

  var isNotTitleOrParticipant = function(statement){
    return !this.isTitle(statement) && !this.isParticipant(statement);
  }.bind(this);

  var removeTitlesAndParticipants = function(statement,statementsContainer){
    if(this.isTitle(statement)){
      titles.push(statement);
    }
    else if(this.isParticipant(statement)){
      participants.push(statement);
    }
    else if(this.isEvent(statement)){
      var leftParticipant = statement.left;
      var rightParticipant = statement.right;

      leftParticipant.inferred(true);
      rightParticipant.inferred(true);

      participants.push(leftParticipant);
      participants.push(rightParticipant);
    }

    statementsContainer.statements(this.shallowStatementFind(statementsContainer.statements(),isNotTitleOrParticipant));
  }.bind(this);

  this.deepStatementFindAndCallback(removeTitlesAndParticipants);

  return {
    titles: titles,
    participants: participants,
  }
}

Sequence.prototype.deepStatementFindAndCallback = function(callback,statementsContainer){
  statementsContainer = statementsContainer || this;

  statementsContainer.statements().forEach(function(statement){
    if(this.isStatementBlock(statement)){
      statement.blocks().forEach(function(statement){
        this.deepStatementFindAndCallback(callback,statement);
        callback(statement,statementsContainer);
      },this);
    }
    else{
      callback(statement,statementsContainer);
    }
  },this);
}

Sequence.prototype.shallowStatementFind = function(statements,shouldFind){
  return statements.filter(function(statement){
    return shouldFind(statement);
  });
}

Sequence.prototype.isTitle = function(statement){ return statement instanceof Title; }

Sequence.prototype.isParticipant = function(statement){ return statement instanceof Participant; }

Sequence.prototype.isEvent = function(statement){ return statement instanceof Event; }

Sequence.prototype.isStatementBlock = function(statement){ return statement instanceof Alternative; }

Sequence.prototype.statements = function(statements){
  if(statements){
    this._statements = statements;
  }

  return this._statements;
}

Sequence.prototype.title = function(title){
  if(title){
    this._title = title;
  }

  return this._title;
}

Sequence.prototype.inferredParticipants = function(){
  return this.shallowStatementFind(this.participants(),function(statement){return statement.inferred();});
}

Sequence.prototype.explicitParticipants = function(){
  return this.shallowStatementFind(this.participants(),function(statement){return !statement.inferred();});
}

Sequence.prototype.participants = function(participants){
  if(participants){
    this._participants = participants;
  }

  return this._participants;
}

Sequence.prototype.stringify = function(){
  var ret = [];

  if(this.title()){
    ret.push(this.title().stringify());
  }

  this.explicitParticipants().forEach(function(statement){
    ret.push(statement.stringify());
  });

  this.statements().forEach(function(statement){
    ret.push(statement.stringify());
  })

  return ret.join('\r\n');
}

module.exports = function(){
  var ret = Object.create(Sequence.prototype);
  Sequence.apply(ret,arguments);

  return ret;
}
module.exports.stringify = function(statements){
  return Sequence.prototype.stringify.apply({statements: function(){return statements;},title: function(){return undefined;},explicitParticipants: function(){return [];}});
}
