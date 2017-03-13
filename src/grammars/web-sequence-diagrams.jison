%lex

%options case-insensitive

%%

\s+ /* skip whitespace */
[\r\n]+           return 'NL';
"title"           return 'TITLE';
"participant"     return 'PARTICIPANT';
"as"              return 'AS';
["]               return 'QUOTE';
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
  | document line
  ;

line
  : statement {}
  | 'NL'
  ;

statement
  : TITLE WORDS {yy.parser.yy.title($2);}
  | participant
  ;

participant
  : PARTICIPANT QUOTE WORDS QUOTE AS WORDS {yy.parser.yy.addParticipant($3,$6);}
  | PARTICIPANT WORDS {yy.parser.yy.addParticipant($2);}
  ;
