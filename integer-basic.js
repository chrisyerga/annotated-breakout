// Object Model
//
// Line (which contains)
// Statement(s) array
//   Variable
//   Expression
//     Operators

var Line = function (number) {
    this.number = number;
    this.statements = [];
};

Line.prototype = {
    print: function () { console.log("[LINE] #" + this.number)}
};

var REGEX_LineNumber = /^\s*(\d+)\s+/;
var REGEX_Identifier = /^\s*([A-Z][A-Z0-9]*)/;
var REGEX_Whitespace = /^\s*/;

var ARGFORMAT_None = 1;             // Like RETURN
var ARGFORMAT_OneNaked = 2;         // Like GOTO XXX
var ARGFORMAT_TwoComma = 3;         // Like POKE XXX,YYY
var ARGFORMAT_OneParens = 4;        // Like PEEK(XXX)
var ARGFORMAT_OneThenStatement = 5; // Like IF XXX THEN SSS
var ARGFORMAT_Assignment = 6;       // Like VVV = XXX

var ARGFORMAT_Strings = [ "<undef>", "", " EXPR:", " EXPR1, EXPR2", "(EXPR)", "EXPR THEN STATMENT", "=EXPR"  ];
var KEYWORDS = { 
    "GOTO":         { isStatement: true, isOperand: false, argumentFormat: ARGFORMAT_OneNaked },
    "ASSIGNMENT":   { isStatement: true, isOperand: false, argumentFormat: ARGFORMAT_Assignment }
};

var Statement = function(identifier) {
    this.identifier = identifier;
    this.op = KEYWORDS[identifier] || Statement.assignVariable;
}

Statement.prototype = {
    toString: function() {
        return "[Statement] " + this.identifier + ARGFORMAT_Strings[this.op.argumentFormat] + (this.op.isStatement ? "isStatement, " : "") + (this.op.isOperand ? "isOperand, " : "");
        
    }
    };

var Parser = function(source, logfn, errfn)
{
    this.sourceCode = source;
    this.logfn = logfn || console.log;
    this.errfn = errfn || console.error;
    
    // Default to verbose logging until this shit works
    this.verbose = true;
    
    this.lines = [];
    this.sourceLines = source.split("\n");
}

Parser.prototype = {
    log: function(args) { if (this.verbose) { this.logfn(args); } },
    
    // Given a regex, gobble it from the source and advance source.
    // Returns null if regex failed or the list of matches
    gobble: function(regex) {
        var matches = this.input.match(regex);
        if (!matches) {
            return null;
        }
        
        // Matched something. Advance source string
        this.log("GOBBLE of (" + regex +") from |" + this.input + "| = " + matches);
        this.input = this.input.substring(matches.shift().length);
        return matches;
    },
    
   parseExpression: function(expression) {
       this.input = expression;
       this.gobble(REGEX_Whitespace);
       if (parseInt(currentSourceLine)) {
           // It's a number
           var lhs = parseInt(currentSourceLine);
       }
   },
    
    parseStatement: function(statement) {
        this.input = statement;
        var keyword = this.gobble(REGEX_Identifier);
        if (!keyword) {
            this.errfn("Expected keyword for statement:" + this.input);
            return;
        }
        
        // Look it up in reserved words table
        statementObj = new Statement(keyword);
        
        // Invalid statment word?
        if (!statementObj.op.isStatement) {
            this.errfn("Keyword \"" + keyword + "\" cannot be used as a statement");
            return;
        }
        
        this.log("Keyword \"" + keyword + "\" has op=" + statementObj);
        
        this.parseArgExpr1(statementObj);
    },
    
    parseLine: function(lineSource) {
        this.input = lineSource;
    
        // Gobble whitespace and skip totally empty lines
        this.gobble(REGEX_Whitespace);
        if (this.input.length === 0) {
            return;
        }
        
        // Get line number and create Line
        var matches = this.gobble(REGEX_LineNumber);
        this.log("[LINENUMBER] matches: " + matches);
        this.currentLine = new Line(parseInt(matches));
        
        // Split line into statements
        var statementsSource = this.input.split(":");
        this.log("LINE #" + matches + " statements:" + statementsSource);
        
        // Parse each statement and add to our current Line object
        for (var index=0; index<statementsSource.length; ++index) {
            var parsedStatement = this.parseStatement(statementsSource[index]);
            this.currentLine.statements.concat(parsedStatement);
        }
    },
    
    parse: function()
    {
        for (var index=0; index<this.sourceLines.length; ++index) {
            this.currentSourceLine = this.sourceLines[index];
            this.parseLine(this.currentSourceLine);
        }
    },
    
};

function StatementGoto()
{}