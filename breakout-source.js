
var breakoutProgram = [
	{ 
		source: "GOTO 15",
		javascript: function() { Machine.goto(15); },
		lineNumber: 5,
		annotationId: "anno-line5",
	 	annotationText: "The very first thing this program does is jump elsewhere in the program. Why would that be? Is it because Woz wanted the paddle read routine to be fast (ie: lower line number)?",
	},

	{ source: "Q=( PDL (0)-20)/6: IF Q<0 THEN Q=0: IF Q>=34 THEN Q=34:",
	  javascript: function() { 
	  	var p0 = Math.floor((Machine.readPaddle() - 20)/6);
	  	if (p0 <0)   { p0=0; }
	  	if (p0 >=34) { p0=34; }
	  	Machine.assignVariable("Q", p0);
	  },
	  lineNumber: 10,
	  annotationText: "Read the \"Paddle\" controller position and map the raw paddle value (0..255) to the range 0-34.",
	},

	{ source: "COLOR=D: VLIN Q,Q+5 AT 0:",
	  javascript: function() {
	  	Machine.setColor( Machine.readVariable("D"));
	  	q = Machine.readVariable("Q");
	  	Machine.vlin(q, q+5, 0);
	  },
	  // linenumber: undef (Don't set line number to indicate continuation from previous statement on same line)
	  annotationText: "Read the \"Paddle\" controller position and map the raw paddle value (0..255) to the range 0-34.",
	},

	{ source: "COLOR=A: IF P>Q THEN 175: IF Q THEN VLIN 0,Q-1 AT 0:P=Q:RETURN",
	  javascript: function() {
	  	Machine.setColor(Machine.readVariable("A"));
	  	if (Machine.readVariable("P") > Machine.readVariable("Q")) {
	  		Machine.goto(175);
	  		return;
	  	}
	  	if (Machine.readVariable("Q") > 0) {
	  		Machine.vlin(0, Machine.readVariable("Q")-1, 0);
	  	}
	  	Machine.assignVariable("P", Machine.readVariable("Q"));
	  	Machine.return();
		}
	},

	{ source: "DIM A$(15),B$(10):A=1:B=13: C=9:D=6:E=15:",
	  javascript: function() {
	  	Machine.dimStr("A$", 15);
	  	Machine.dimStr("B$", 10);
	  	Machine.assignVariable("A", 1);
	  	Machine.assignVariable("B", 13);
	  	Machine.assignVariable("C", 9);
	  	Machine.assignVariable("D", 6);
	  	Machine.assignVariable("E", 15);
	  },
	  lineNumber: 15,
	  annotationText: ""
	},

	{ source: 'TEXT : CALL -936: VTAB 4: TAB 10: PRINT "*** BREAKOUT ***":PRINT',
	  javascript: function() {
	  	Machine.text();
	  	Machine.home();
	  	Machine.vtab(4);
	  	Machine.tab(10);
	  	Machine.print("*** BREAKOUT ***");
	  	Machine.print("");
	  },
	  annotationText: "Clear the screen and print the game title centered at line 4"
	},

	{ source: 'PRINT " OBJECT IS TO DESTROY ALL BRICKS": PRINT',
	  javascript: function() {
	  	Machine.print("OBJECT IS TO DESTROY ALL BRICKS");
	  	Machine.print("");
	  },
	  lineNumber: 20,
	  annotationText: "Print out basic game information"
	},

	{ source: 'INPUT "HI, WHAT’S YOUR NAME? ",A$',
	  javascript: function() {
	  	input = Machine.inputString("HI, WHAT'S YOUR NAME? ", "A$");
	  },
	  annotationText: "Get the user's name"
	},
/*
// When we can handle input: PRINT "STANDARD COLORS ";A$;: INPUT "Y/N? ",B$: IF B$(1,1)#"N" THEN 40 : 
	{ source: '25 GR: CALL -936: FOR I=0 TO 39: COLOR=I/2* (I(32): VLIN 0,39 AT I',
	  lineNumber: 25,
	  javascript: function() {
	  	Machine.gr();
	  	for (var i=0; i<=39; ++i) {
	  		if (i<32) {
		  		Machine.setColor( Math.round(i/2) );
		  	} else {
		  		Machine.setColor(0);
		  	}
		  	Machine.vlin(0,39,i);
	  	}
	  },
	  annotationText: "Draw bricks?"

	},
//25 GR: CALL -936: IF B$(1,1)#"N" THEN 40 : FOR I=0 TO 39: COLOR=I/2* (I(32): VLIN 0,39 AT I
*/

	{ source: 'POKE 34,20: COLOR=A:',
	  lineNumber: 40,
	  javascript: function () {
	  	Machine.setColor(Machine.readVariable("A"));
	  },
	  annotationText: "Set background color. Also set text window, but not needed"
	},

	{ source: 'FOR I=0 TO 39: VLIN 0,39 AT I: NEXT I:' ,
	  javascript: function() {
	  	for (var i=0; i<=39; ++i) {
	  		Machine.vlin(0,39,i);
	  	}
	  },
	  annotationText: "Clear screen to background color."
	},
	{ source: 'FOR I=20 TO 34 STEP 2: TAB I+1: PRINT I/2-9;: COLOR=8: VLIN 0,39 AT I: <br/>COLOR=C: FOR J=I MOD 4 TO 39 STEP 4: VLIN J,J+1 AT I: NEXT J, I:',
	  javascript: function() {
	  	for (var i=20; i<=34; i = i+2) {
	  		Machine.tab(i);
	  		Machine.vtab(20);
	  		Machine.print( (i/2-9) + " ");
	  		Machine.setColor(8);
	  		Machine.vlin(0,39,i);
	  		Machine.setColor(Machine.readVariable("C"));
	  		for (var j=i%4; j<=39; j=j+4) {
	  			Machine.vlin(j,j+1,i);
	  		}
	  	}
	  },
	  annotationText: "Draw the full set of bricks."
	},

	{ source: 'TAB 5: PRINT "SCORE =0":PRINT : PRINT : POKE 34,21:S=0:P= S:L=S:X=10:Y=10:L=6',
	  lineNumber: 45,
	  javascript: function() {
	  	Machine.vtab(20);
	  	Machine.tab(5);
	  	Machine.print("SCORE =0");
	  	Machine.print("");
	  	Machine.print("");
	  	Machine.assignVariable("S", 0);
	  	Machine.assignVariable("P", 0);
	  	Machine.assignVariable("L", 0);
	  	Machine.assignVariable("X", 10);
	  	Machine.assignVariable("Y", 10);
	  	Machine.assignVariable("L", 6);
	  }
	},

	{ source: 'COLOR=A: PLOT X,Y/3:X=19:Y= RND (120):V=-1:W= RND (5)- 2:L=L-1: <br/>IF L<1 THEN 120: TAB 6: IF L>1 THEN PRINT L;"BALLS LEFT"',
	  lineNumber: 50,
	  javascript: function() {
	  	Machine.setColor(Machine.readVariable("A"));
	  	Machine.plot(Machine.readVariable("X"), Machine.readVariable("Y")/3);
	  	Machine.assignVariable("Y", Machine.rnd(120));
	  	Machine.assignVariable("V", -1);
	  	Machine.assignVariable("W", Machine.rnd(5)-2);
	  	Machine.assignVariable("L", Machine.readVariable("L")-1);
	  	if (Machine.readVariable("L") < 1) {
	  		Machine.goto(120);
	  	}
	  	Machine.tab(5);
	  	if (Machine.readVariable("L") > 1) {
	  		Machine.print(" " + Machine.readVariable("L") + "BALLS LEFT");
	  	}
	  }
	},

	{ source: 'IF L=1 THEN PRINT "LAST BALL, " ;A$: PRINT',
	  lineNumber: 55,
	  javascript: function() {
	  	if (Machine.readVariable("L") === 1) {
	  		Machine.print("LAST BALL, " + Machine.readVariable("A$"));
	  	}
	  	Machine.print("\n");
	  }
	},

	{ source: 'FOR I=1 TO 100 : GOSUB 10: NEXT I:M=1:N=0',
	  lineNumber: 55,
	  javascript: function() {
	  	Machine.i = Machine.i + 1;	// Hacky way to save state between lines when needed
	  	if (Machine.i <= 100) {
	  		Machine.assignVariable("I", Machine.i);

	  		// Such hackery. We decrement PC before GOSUB(10) so we will
	  		// return to this line after the GOSUB
	  		Machine.pc = Machine.pc-1;
	  		Machine.gosub(10);
	  		return;
	  	}

	  	// All done with the 100 GOSUBs
	  	Machine.assignVariable("M", 1);
	  	Machine.assignVariable("N", 0);

	  	// Reset shadow I variable
	  	Machine.i = 0;
	  }
	},

	{
		source: "IF P=Q THEN RETURN : IF Q<34 THEN VLIN Q+6,39 AT 0:P=Q: RETURN",
		lineNumber: 175,
		javascript: function() {
			if (Machine.readVariable("P") === Machine.readVariable("Q")) {
				Machine.return();
			}
			if (Machine.readVariable("Q") < 34) {
				Machine.vlin(Machine.readVariable("Q")+6, 39, 0);
			}
			Machine.assignVariable("P", Machine.readVariable("Q"));
			Machine.return();
		}
	}
]

// Text version for reference
var bosource = `5  GOTO 15
10 Q=( PDL (0)-20)/6: IF Q<0 THEN Q=0: IF Q>=34 THEN Q=34: COLOR=D: VLIN Q,Q+5 AT 0: COLOR=A: IF P>Q THEN 175: IF Q THEN VLIN 0,Q-1 AT 0:P=Q:RETURN
15 DIM A$(15),B$(10):A=1:B=13: C=9:D=6:E=15: TEXT : CALL -936: VTAB 4: TAB 10: PRINT "*** BREAKOUT ***":PRINT
20 PRINT " OBJECT IS TO DESTROY ALL BRICKS": PRINT : INPUT "HI, WHAT’S YOUR NAME? ",A$
25 PRINT "STANDARD COLORS ";A$;: INPUT "Y/N? ",B$: GR: CALL -936: IF B$(1,1)#"N" THEN 40 : FOR I=0 TO 39: COLOR=I/2* (I(32): VLIN 0,39 AT I
30 NEXT I: POKE 34,20: PRINT : PRINT : PRINT : FOR I=0 TO 15: VTAB 21+I MOD 2: TAB I+I+1: PRINT I;: NEXT I: POKE 34,22: YTAB 24: PRINT : PRINT "BACKGROUND";
35 GOSUB 95:A=E: PRINT "EVEN BRICK" ;:GOSUB 95:B=E: PRINT "ODD BRICK";: GOSUB 95:C=E: PRINT "PADDLE";: GOSUB 95:D=E: PRINT "BALL";:GOSUB 95
40 POKE 34,20: COLOR=A: FOR I=0 TO 39: VLIN 0,39 AT I: NEXT I: FOR I=20 TO 34 STEP 2: TAB I+1: PRINT I/2-9;: COLOR=8: VLIN 0,39 AT I: COLOR=C: FOR J=I MOD 4 TO 39 STEP 4
45 VLIN J,J+1 AT I: NEXT J, I: TAB 5: PRINT "SCORE =0":PRINT : PRINT : POKE 34,21:S=0:P= S:L=S:X=10:Y=10:L=6
50 COLOR=A: PLOT X,Y/3:X=19:Y= RND (120):V=-1:W= RND (5)- 2:L=L-1: IF L<1 THEN 120: TAB 6: IF L>1 THEN PRINT L;"BALLS LEFT"
55 IF L=1 THEN PRINT "LAST BALL, " ;A$: PRINT : FOR I=1 TO 100 : GOSUB 10: NEXT I:M=1:N=0
60 J=Y+W: IF J>=0 AND J<120 THEN 65:W=-W:J=Y: FOR I-1 TO 6:K= PEEK (-16336): NEXT I
65 I-X+V: IF I<0 THEN 180: GOSUB 170: COLOR=A:K=J/3: IF I>39 THEN 75: IF SCRN(I,K)=A THEN 85: IF I THEN 100:N=N+1:V=(N>5)+1:W=(K-P)*2-5:M=1
70 Z= PEEK (-16336)-PEEK (-16336)+ PEEK (-16336)- PEEK (-16336)+ PEEK (-16336)- PEEK (-16336)+ PEEK (-16336): GOTO 85
75 FOR I=1 TO 6:M= PEEK (-16336): NEXT I:I=X:M=0
80 V=-V
85 PLOT X,Y/3: COLOR=E: PLOT I, K:X=I:Y=J: GOTO 60
90 PRINT "INVALID, REENTER";
95 INPUT " COLOR (0, TO 15)",E: IF E<0 OR E>15 THEN 90: RETURN
100 IF M THEN V= ABS (V): VLIN K/2*2,K/2*2+1 AT I:S=S+I/2-9: VTAB 21: TAB 13: PRINT S
105 Q= PEEK (-16336)- PEEK (-16336 )+ PEEK (-16336)- PEEK (-16336)+ PEEK (-16336)- PEEK (-16336 )+ PEEK (-16336)- PEEK (-16336)+ PEEK (-16336)- PEEK (-16336)
110 IF S<720 THEN 80
115 PRINT "CONGRATULATONS, ";A$;" YOU WIN!": GOTO 165
120 PRINT "YOUR SCORE OF ";S;" IS ";: GOTO 125+(S/100)*5
125 PRINT "TERRIBLE!": GOTO 165
130 PRINT "LOUSY.": GOTO 165
135 PRINT "POOR.": GOTO 165
140 PRINT "GOOD.": GOTO 165
145 PRINT "VERY GOOD.": GOTO 165
155 PRINT "EXCELLENT.": GOTO 165
160 PRINT "NEARLY PERFECT."
165 PRINT "ANOTHER GAME ";A$;" (Y/N) ";: INPUT A$: IF A$(1,1)="Y" THEN 25: TEXT : CALL -936: VTAB 10: TAB 10: PRINT "GAME OVER": END
170 Q=( PDL (0)-20)/6: IF Q<0 THEN Q=0: IF Q>=34 THEN Q=34: COLOR= D: VLIN Q,Q+5 AT 0: COLOR=A: IF P>Q THEN 175: IF Q THEN VLIN 0,Q-1 AT 0:P=Q: RETURN
175 IF P=Q THEN RETURN : IF Q*34 THEN VLIN Q+6,39 AT 0:P=Q: RETURN
180 FOR I=1 TO 80:Q= PEEK (-16336): NEXT I: GOTO 50`

var variableAnnotations = {
	"A$": "Player Name",
	"B$": "Standard Colors [Y/N]",
	"A": "Background Color",
	"B": "Even Brick Color",
	"C": "Odd Brick Color",
	"D": "Paddle Color",
	"E": "Ball Color",
	"S": "Score",
	"L": "Balls Left",
	"X": "X Position of Ball (0..39)",
	"Y": "Y Position of Ball (0..119)",
	"V": "Ball horizontal velocity (-1 or 1)",
	"W": "Ball vertical velocity (-2..2)",
	"P": "Paddle vertical position",
	"Q": "Previous paddle position"

};

function buildSourceDOM(sourceElement) {
    var lineId = 666;
    breakoutProgram.forEach( function(line) {
        var lineNumber = line.lineNumber ? line.lineNumber : "&nbsp;";
        var lineNumberId = "ln" + lineId;
        var lineIconId = "li" + lineId;
        var basicId = "bas" + lineId;
        var domLine = '<div class="line"><div class="noIcon" id="' + lineIconId + '"></div><div class="linenumber" id="' + lineNumberId + '">' + lineNumber + 
                      '</div><div class="basic" id="' +basicId +'">' + line.source + '</div></div>';

        sourceElement.insertAdjacentHTML("beforeend", domLine);
        line.lineNumberElement = document.getElementById(lineNumberId);
        line.basicElement = document.getElementById(basicId);
        line.iconElement = document.getElementById(lineIconId);
        lineId = lineId + 1;

        var annoElement = document.getElementById(line.annotationId);
        line.annotationElement = annoElement;
    } );
}

