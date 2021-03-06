%lex

%options case-insensitive

%%

\s+ /* skip whitespace */
[\r\n]+           return 'NL';
"title"           return 'TITLE';
"autonumber off"  return 'AUTO_NUMBER_OFF';
"autonumber"      return 'AUTO_NUMBER_ON';
"participant"     return 'PARTICIPANT';
"as"              return 'AS';
"alt"             return 'ALT';
"else"            return 'ELSE';
"end"             return 'END';
[0-9]+            return 'INTEGER';
["]               return 'QUOTE';
":"               return 'SEPARATOR';
">>"              return 'ARROW_RIGHT_OPEN';
">"               return 'ARROW_RIGHT_CLOSED';
"<<"              return 'ARROW_LEFT_OPEN';
"<"               return 'ARROW_LEFT_CLOSED';
"--"              return 'DOTTED_LINE';
"-"               return 'SOLID_LINE';
/*"-"              return 'DEACTIVATE_ON_LINE';*/
"*"               return 'CREATE_ACTOR_ON_LINE';
"+"               return 'ACTIVATE_ON_LINE';
[a-zA-Z ]+        return 'WORDS';
<<EOF>>           return 'EOF';
.                 return 'INVALID';

/lex

%start start

%%

start
  : document EOF {return $document;}
  ;

document
  : /* empty */
  | document line {var history=$document||[];history.push($line);$$=history;}
  ;

line
  : statement
  | 'NL'
  ;

statement
  : TITLE words {$$=yy.parser.yy.title($words);}
  | participant
  | event
  | autonumber
  | alternative
  ;

participant
  : PARTICIPANT words[actor] AS words[alias] {$$=yy.parser.yy.participant($actor,$alias);}
  | PARTICIPANT words[actor] {$$=yy.parser.yy.participant($actor);}
  ;

event
  : actor[left_actor] connection actor[right_actor] SEPARATOR words {$$=yy.parser.yy.event(yy.parser.yy.participant($left_actor),$connection,yy.parser.yy.participant($right_actor),$words)}
  ;

autonumber
  : AUTO_NUMBER_ON INTEGER {$$=yy.parser.yy.autoNumber($INTEGER);}
  | AUTO_NUMBER_OFF {$$=yy.parser.yy.autoNumber();}
  ;

alternative
  : ALT alternative_block {$$=yy.parser.yy.alternative($alternative_block);}
  ;

alternative_block
  : WORDS document alternative_block {var hist=$alternative_block||[];hist.unshift(yy.parser.yy.namedBlock($WORDS,$document));$$=hist;}
  | END {$$=undefined;} /* Needed or Jison will default to returning $1 i.e 'END', this would break everything*/
  | ELSE alternative_block {$$=$alternative_block;}
  ;

actor
  : QUOTE WORDS QUOTE { $$ = $WORDS }
  | WORDS { $$=$WORDS }
  ;

words
  : QUOTE WORDS QUOTE { $$=$WORDS; }
  | WORDS { $$=$WORDS }
  ;

connection
  : left_arrow line_type right_arrow create_actor activate { var ret=new Object();ret.arrowLeft=$left_arrow;ret.arrowRight=$right_arrow;ret.lineType=$line_type;ret.createActor=$create_actor;ret.activate=$activate;$$=ret; }
  ;

create_actor
  : /**none**/ { $$=yy.parser.yy.event.NONE }
  | CREATE_ACTOR_ON_LINE { $$=yy.parser.yy.event.CREATOR }
  ;

activate
  : /**none**/ { $$=yy.parser.yy.event.NONE }
  | ACTIVATE_ON_LINE { $$=yy.parser.yy.event.ACTIVATOR }
  | SOLID_LINE { $$=yy.parser.yy.event.DEACTIVATOR }
  /*| DEACTIVATE_ON_LINE { $$='-' }*/
  ;

left_arrow
  : /**none**/ { $$=yy.parser.yy.event.NONE }
  | ARROW_LEFT_CLOSED { $$=yy.parser.yy.event.ARROW_LEFT_CLOSED }
  | ARROW_LEFT_OPEN { $$=yy.parser.yy.event.ARROW_LEFT_OPEN }
  ;

right_arrow
  : ARROW_RIGHT_CLOSED { $$=yy.parser.yy.event.ARROW_RIGHT_CLOSED }
  | ARROW_RIGHT_OPEN { $$=yy.parser.yy.event.ARROW_RIGHT_OPEN }
  ;

line_type
  : SOLID_LINE { $$=yy.parser.yy.event.LINE_SOLID }
  | DOTTED_LINE { $$=yy.parser.yy.event.LINE_DASHED }
  ;
