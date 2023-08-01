// Apple II hardware simulation

var Machine = {};

// Call to attach to canvas for display
Machine.init = function(canvas, varsdiv, annodiv, program, screendiv) {
    Machine.canvas = canvas;
    Machine.dc = canvas.getContext('2d');
    Machine.program = program;
    Machine.pc = 0; // Start at first line
    Machine.varsdiv = varsdiv;
    Machine.annodiv = annodiv;
    Machine.screendiv = screendiv;

    var width = canvas.width;
    var height = canvas.height;

    // We only do LORES graphics, so calculate pixel size for 40x40 graphics
    // with 4 lines of text at the bottom. Each character is 2 lores pixels
    // high, so the virtual graphics pixel size is 40x48
    Machine.pixelWidth = Math.floor(width / 40);
    Machine.pixelHeight = Math.floor(height / 48);

    // Clear screen
    Machine.gr();

    // Clear variable space
    Machine.scalars = {};
    Machine.strings = {};

    // Initialize gosub stack
    Machine.gosubStack = [];

    // Initialize hacky loop iteration state
    Machine.i = 0;
}

Machine.idle = function() {

}

Machine.gr = function() {
    // Clear the wholr screen to black
    Machine.dc.fillStyle = "#000";
    Machine.dc.fillRect(0,0,9999,9999);
}

Machine.text = function() {
    // Don't bother to handle display modes. Doesn't matter for breakout
    Machine.gr();
}

Machine.home = function() {
    Machine.gr();
    Machine.textX = 0;
    Machine.textY = 0;
}

Machine.vtab = function(y) {
    Machine.textY = y;
}

Machine.tab = function(x) {
    Machine.textX = x;
}

Machine.print = function(str) {
    Machine.dc.fillStyle = "rgb(20,245,60)";    // Use green
    Machine.dc.font = " " + (Machine.pixelHeight*2+4) + "px monospace";
    Machine.dc.textBaseline = "hanging";
    Machine.dc.fillText(str, Machine.textX*Machine.pixelWidth, Machine.textY*Machine.pixelHeight*2);

    // Emulate CR/LF. Scrolling not handled
    Machine.textY++;
    Machine.textX = 0;
}

Machine.handleInputKey = function(evt)
{
    console.log("EVT: " + evt.key);
}
Machine.inputString = function(str, varname) {
    var oldX = Machine.textX;
    var oldY = Machine.textY;

    Machine.print(str);
    Machine.textX = oldX + str.length;
    Machine.textY = oldY;

    Machine.doingInput = true;
    Machine.dc.fillStyle = "rgb(255,255,255)";    // Use green
    Machine.dc.font = " " + (Machine.pixelHeight*2+4) + "px monospace";
    Machine.dc.textBaseline = "hanging";
    Machine.dc.fillText('WOZ', Machine.textX*Machine.pixelWidth, Machine.textY*Machine.pixelHeight*2);
    Machine.assignVariable(varname, "WOZ");
}

// LORES palette based on NTSC analysis here: http://mrob.com/pub/xapple2/colors.html
// I modified some of the colors to make them more saturated and "true" to their names
// which looks better but is probably less accurate to how they looked on a TV in 1979
Machine.palette = [
    "rgb(0,0,0)",           // 0: BLACK
    "rgb(140,30,96)",       // 1: MAGENTA (No red, lol!)
    "rgb(96,78,189)",       // 2: DK BLUE
    "rgb(255,68,253)",      // 3: PURPLE
    "rgb(0,163,96)",        // 4: DK GREEN
    "rgb(130,130,130)",     // 5: GRAY
    "rgb(20,75,253)",      // 6: MED BLUE
    "rgb(120,175,255)",     // 7: LT BLUE
    "rgb(96,114,3)",        // 8: BROWN
    "rgb(255,106,60)",      // 9: ORANGE
    "rgb(156,156,156)",     // 10:GRAY (same as 5)
    "rgb(255,160,208)",     // 11:PINK
    "rgb(20,245,60)",       // 12:LT GREEN
    "rgb(245,245,65)",     // 13:YELLOW
    "rgb(114,255,208)",     // 14:AQUA
    "rgb(255,255,255)",     // 15:WHITE
    ];

Machine.setColor = function(val) {
    Machine.color = val;
    Machine.dc.fillStyle = Machine.palette[val];
}

Machine.plot = function(x,y) {
    Machine.dc.fillRect( x*Machine.pixelWidth, y*Machine.pixelHeight, Machine.pixelWidth, Machine.pixelHeight);
}

Machine.vlin = function(y1,y2,x) {
    Machine.dc.fillRect(x*Machine.pixelWidth, y1*Machine.pixelHeight, Machine.pixelWidth, (y2-y1+1)*Machine.pixelHeight);
}

Machine.rebuildVarsDiv = function() {
    Machine.varsdiv.innerHTML = "";
    var newdiv = '<div class="strings">';
    for (key in Machine.strings) {
        newdiv += '<div class="variable"><div class="varname';
        if (Machine.strings[key].accessed) {
            newdiv += ' accessed';
        }
        newdiv += '">' + key + " = " + Machine.strings[key].value + "</div>";

        var varAnno = variableAnnotations[key];
        newdiv += '<div class="varanno">' + varAnno + '</div></div>'
    }

    newdiv += '</div><div class="scalars">';
    for (key in Machine.scalars) {
        newdiv += '<div class="variable"><div class="varname';
        if (Machine.scalars[key].accessed) {
            newdiv += ' accessed';
        }
        newdiv += '">' + key + " = " + Machine.scalars[key].value + "</div>";

        var varAnno = variableAnnotations[key];
        newdiv += '<div class="varanno">' + varAnno + '</div></div>'
    }
    newdiv += '</div>';

    Machine.varsdiv.insertAdjacentHTML("beforeend", newdiv);
}

Machine.dimStr = function(name) {
    Machine.strings[name] = { "name": name, "value": "", accessed: false };
    Machine.rebuildVarsDiv();
}

Machine.readVariable = function(name) {
    var variable; 
    if (name[name.length-1] === "$") {
        variable = Machine.strings[name];
    } else {
        variable = Machine.scalars[name];
    }
    variable.accessed = true;
    return variable.value;
}

Machine.assignVariable = function(name, value) {
    if (name[name.length-1] === "$") {
        Machine.strings[name] = { "name": name, "value": value, accessed: true };
    } else {
        Machine.scalars[name] = { "name": name, "value": value, accessed: true };
    }
    Machine.rebuildVarsDiv();
}

Machine.rnd = function(range) {
    return Math.floor(Math.random()*range);
}

Machine.readPaddle = function() {
    return mouseY - Machine.screendiv.offsetTop;
}

Machine.lineToIndex = function(line) {

    for (var index=0; index<Machine.program.length; ++index) {
        if (Machine.program[index].lineNumber === line) {
            return index;
        }
    }

    // No such line number
    return -1;
}

Machine.goto = function(line) {
    var index = Machine.lineToIndex(line);
    if (index >= 0) {
        Machine.pc = index;
        Machine.tookABranch = true;
        return;        
    }

    console.error("GOTO " + line + ": NO SUCH LINE");
    console.poop;
}

Machine.gosub = function(line) {
    var index = Machine.lineToIndex(line);
    if (index >= 0) {
        Machine.gosubStack.push(Machine.pc);
        Machine.pc = index;
        Machine.tookABranch = true;
        return;
    }

    console.error("GOSUB " + line + ": NO SUCH LINE");
    console.poop;
}

Machine.return = function() {
    var returnPC = Machine.gosubStack.pop();
    Machine.pc = returnPC+1;    // This implies GOSUB must be the last statement on a line
    Machine.tookABranch = true;
}

Machine.step = function() {
    // Init to false. If the code executes a GOTO/GOSUB this gets set to true so we know 
    // not to auto-increment the PC
    Machine.tookABranch = false;

    // Clear out the "accessed" property of all variables. Any variables read
    // by this line of code will get it assigned again
    for (key in Machine.strings) {
        Machine.strings[key].accessed = false;
    }
    for (key in Machine.scalars) {
        Machine.scalars[key].accessed = false;
    }

    var statement = Machine.program[Machine.pc];
    console.log("STEP at PC=" + Machine.pc + " (Line " + (statement.lineNumber || "(cont)") + ")");
    console.log("    CODE: " + statement.source);
    console.log("    ANNO: " + statement.annotationText)

    Machine.lastpc = Machine.pc;
    statement.javascript();

    if (!Machine.tookABranch) {
        // Next statement
        Machine.pc += 1;        
    }

    // Unhighlight last line and highlight current line
    Machine.program[Machine.lastpc].basicElement.className = "basic";
    Machine.program[Machine.pc].basicElement.className = "basic step";
    AnimateBorderRightColor( Machine.program[Machine.lastpc].iconElement, [0,80,140], [255,255,255], 300);
    AnimateBorderRightColor( Machine.program[Machine.pc].iconElement, [255,255,255], [0,80,140],  300);

    // Update variables display
    Machine.rebuildVarsDiv();

    // Show popup annotation
    Machine.program[Machine.lastpc].annotationElement.style = "display: none";
    Machine.program[Machine.pc].annotationElement.style = "display: block";
}


