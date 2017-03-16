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
"opt"             return 'OPT';
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
  : document EOF {return yy.parser.yy;}
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
  : TITLE words {yy.parser.yy.title($words);}
  | participant
  | event
  | autonumber
  | optional
  ;

participant
  : PARTICIPANT words[actor] AS words[alias] {yy.parser.yy.addParticipant($actor,$alias);}
  | PARTICIPANT words[actor] {yy.parser.yy.addParticipant($actor);}
  ;

event
  : actor[left_actor] connection actor[right_actor] SEPARATOR words {yy.parser.yy.addEvent($left_actor,$connection,$right_actor,$words)}
  ;

autonumber
  : AUTO_NUMBER_ON INTEGER {yy.parser.yy.autoNumberOn($INTEGER);}
  | AUTO_NUMBER_OFF {yy.parser.yy.autoNumberOff();}
  ;

optional
  : OPT optional_block {console.log($optional_block);$$='opt-st='+$optional_block.length;}
  ;

optional_block
  : WORDS document optional_block {var hist=$optional_block||[];hist.push($document);$$=hist;}
  | END {$$=undefined;} /* Needed or Jison will default to returning $1 i.e 'END', this would break everything*/
  | ELSE optional_block {$$=$optional_block;}
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
  : left_arrow line_type right_arrow create_actor activate { $$=$left_arrow+$line_type+$right_arrow+$create_actor+$activate }
  ;

create_actor
  : /**none**/ { $$='' }
  | CREATE_ACTOR_ON_LINE { $$='*' }
  ;

activate
  : /**none**/ { $$='' }
  | ACTIVATE_ON_LINE { $$='+' }
  | SOLID_LINE { $$='-' }
  /*| DEACTIVATE_ON_LINE { $$='-' }*/
  ;

left_arrow
  : /**none**/ { $$='' }
  | ARROW_LEFT_CLOSED { $$='<' }
  | ARROW_LEFT_OPEN { $$='<<' }
  ;

right_arrow
  : ARROW_RIGHT_CLOSED { $$='>' }
  | ARROW_RIGHT_OPEN { $$='>>' }
  ;

line_type
  : SOLID_LINE { $$='-' }
  | DOTTED_LINE { $$='--' }
  ;
