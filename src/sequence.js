var Title = require('../src/title.js');
var Participant = require('../src/participant.js');
var Event = require('../src/event.js');
var AutoNumber = require('../src/auto-number.js');
var Alternative = require('../src/alternative.js');
var Participant = require('../src/participant.js');
var Sequence = require('../src/sequence-parser.js');

var Sequence = function(statements){
  this._statements = statements||[];

  this.init();
};

Sequence.prototype.init = function(){
  var titlesAndParticipants = this.removeTitlesAndParticipants();
  this.deduplicate(titlesAndParticipants);
}

Sequence.prototype.deduplicate = function(titlesAndParticipants){
  this.deduplicateTitles(titlesAndParticipants.titles);
  this.deduplicatedParticipants(titlesAndParticipants.participants);
}

Sequence.prototype.deduplicateTitles = function(titles){
  var title = titles.pop();

  if(title){
    this.title(title);
  }
}

Sequence.prototype.deduplicatedParticipants = function(participants){
  this.deduplicateParticipantList(participants);
  this.deduplicatedParticipantsWithinOtherStatements();
}

Sequence.prototype.deduplicatedParticipantsWithinOtherStatements = function(){
  var findParticipant = function(find){
    var found = this.shallowStatementFind(
      this.participants(),
      function(statement){return statement.shortName()===find.shortName()}
    );

    return found.pop();
  }.bind(this);

  var callback = function(statement,statementsContainer){
    if(this.isEvent(statement)){
      var left = statement.left;
      var right = statement.right;

      statement.left = findParticipant(left);
      statement.right = findParticipant(right);
    }
  }.bind(this);

  this.deepStatementFindAndCallback(callback);
}

Sequence.prototype.deduplicateParticipantList = function(participants){
  function formulateParticipantMap(){
    var aliasesOrder = [];
    var aliasToParticipant = {};

    participants.forEach(function(participant){
      var alias = participant.shortName();

      var participants = aliasToParticipant[alias]||[];
      participants.push(participant);

      aliasToParticipant[alias] = participants;

      if(aliasesOrder.indexOf(alias)===-1){
        aliasesOrder.push(alias);
      }
    });

    return {
      aliasesOrder: aliasesOrder,
      aliasToParticipant: aliasToParticipant
    }
  }

  function reduceParticipantsForAnAlias(participants){
    var firstExplicit = undefined;
    var firstInferred = undefined;

    participants.forEach(function(participant){
      if(participant.inferred()){
        if(!firstInferred){
          firstInferred = participant;
        }
      }
      else{
        if(!firstExplicit){
          firstExplicit = participant;
        }
      }
    });

    return firstExplicit||firstInferred;
  }

  function reduceParticipants(map){
    var reducedParticipants = [];

    map.aliasesOrder.forEach(function(alias){
      reducedParticipants.push(reduceParticipantsForAnAlias(map.aliasToParticipant[alias]));
    });

    return reducedParticipants;
  }

  var map = formulateParticipantMap();
  this.participants(reduceParticipants(map));
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

if(typeof window != 'undefined'){
    window.__sequence = module.exports;
}
