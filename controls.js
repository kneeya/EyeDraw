// install window 
paper.install(window);

// default variables

var pencilPath;
var pencil;
var isDrawing = false;
var beginDrawing = false;
var doneDrawing = false;

var speed = 3;

var destination = {
    x: null, y: null
};

var colours = {
    'red': '#FF0000',
    'orange': '#FF5733 ',
    'yellow': '#FFD00E',
    'green': '#00C10F',
    'blue': '#0000FF',
    'purple': '#800080',
    'black': '#000'
}
var currentColour = colours['black'];

var sizes = {
    'small': 1,
    'medium': 5,
    'large': 10,
}
var currentSize = sizes['medium'];

var opacities = {
    'light': 0.25,
    'translucent': 0.5,
    'dark': 1
}
var currentOpacity = opacities['dark'];

// Initialize Path

function initializePath() {
    pencilPath = new Path();
    pencilPath.strokeColor = currentColour;
    pencilPath.strokeWidth = currentSize*2;
    pencilPath.opacity = currentOpacity;
    pencilPath.strokeJoin = 'round';
    pencilPath.strokeCap = 'round';
}

// Reset pencil after each command

function reset() {
    let prevPosition = {
        x: pencil.position.x,
        y: pencil.position.y,
    }
    pencil.remove(),
    pencil = new Path.Circle(new Point(prevPosition.x, prevPosition.y), currentSize);
    pencil.strokeColor = 'black';
    pencil.fillColor = currentColour;
    pencil.fillColor.opacity = currentOpacity;
}

// Cursor and path randomization

window.onload = function() {
    paper.setup('myCanvas');
  pencil = new Path.Circle(new Point(80, 50), currentSize);
  pencil.strokeColor = 'black';
  pencil.fillColor = currentColour;
  pencil.fillColor.opacity = currentOpacity;
  pencilPath = new Path();
  
  destination = {
    x: Math.floor(view.size.width * Math.random()),
    y: Math.floor(view.size.height * Math.random())
  };

  view.onFrame = function(event) {
    if (event.count % 2) return;
    var vector = {
      x: destination.x - pencil.position.x,
      y: destination.y - pencil.position.y,
    };
    length = Math.sqrt(vector.x**2 + vector.y**2)

    pencil.position.x += (vector.x/length)*speed; 
    pencil.position.y += (vector.y/length)*speed; 
   
    if (isDrawing && !beganDrawing) {
      pencilPath = new Path();
      pencil.insertBelow(pencilPath)
      pencilPath.strokeColor = currentColour;
      pencilPath.strokeWidth = currentSize*2;
      pencilPath.opacity = currentOpacity;
      beganDrawing = true;
    }

    if (isDrawing) {
      pencilPath.add(new Point(pencil.position.x, pencil.position.y));
    }

    if (length < 20) {
      if (isDrawing) {
        pencilPath.flatten();
      }
      destination = {
        x: Math.floor(view.size.width * Math.random()),
        y: Math.floor(view.size.height * Math.random())
      };
    }
  }
}

// Voice

const artyom = new Artyom(); 

voicePrompts = [
    {
        indexes: ['start'],
        action: (i) => {
            isDrawing = true;
        }
    },
    {
        indexes: ['stop'],
        action: (i) => {
            isDrawing = false;
            beganDrawing = false;
            doneDrawing = true;
        }
    },
    {
        indexes: ['red', 'orange', 'yellow', 'green', 'blue', 'purple', 'black'],
        action: function(i) {
            if (i==0) currentColour - colours['red'];
            if (i==1) currentColour - colours['orange'];
            if (i==2) currentColour - colours['yellow'];
            if (i==3) currentColour - colours['green'];
            if (i==4) currentColour - colours['blue'];
            if (i==5) currentColour - colours['purple'];
            if (i==6) currentColour - colours['black'];
            setPath();
            penReset();
        }
    }
]

// Activates commands
artyom.addCommands(voicePrompts); // Add voice commands with addCommands

// This function activates artyom and will listen all that you say forever (requires https conection, otherwise a dialog will request if you allow the use of the microphone)
function startContinuousArtyom(){
    artyom.fatality();// use this to stop any of

    setTimeout(function(){// if you use artyom.fatality , wait 250 ms to initialize again.
         artyom.initialize({
            lang:"en-GB",// A lot of languages are supported. Read the docs !
            continuous:true,// Artyom will listen forever
            listen:true, // Start recognizing
            debug:true, // Show everything in the console
            speed:1 // talk normally
        }).then(function(){
            console.log("Ready to work !");
        });
    },250);
}