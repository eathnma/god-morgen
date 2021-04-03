var person = prompt("Please enter your name", "Harry Potter");

var blue = 'rgb(88, 168, 253)';
var green = 'rgb(32, 190, 114)';
var indigo = 'rgb(90, 96, 254)';
var mustard = 'rgb(248, 188, 72)';
var orange = 'rgb(248, 84, 48)';
var plum = 'rgb(143, 23, 97)';

var colors = [blue, green, indigo, mustard, orange, plum];

this.randomColor = colors[Math.floor(Math.random() * colors.length)];
    
var Engine = Matter.Engine,
    Render = Matter.Render,
    Runner = Matter.Runner,
    Common = Matter.Common,
    Composite = Matter.Composite,
    Composites = Matter.Composites,
    MouseConstraint = Matter.MouseConstraint,
    Mouse = Matter.Mouse,
    Events = Matter.Events,
    World = Matter.World,
    Bodies = Matter.Bodies;

//Engine (physics)
var engine = Engine.create(),
    world = engine.world;

Engine.run(engine);

//Renderer (graphics)
var render = Render.create({
    element: document.body,
    engine: engine,
    options: {
        width: window.innerWidth,
        height: window.innerHeight,
        wireframes: false,
        background: 'white'
    }
});

Render.run(render);

//Runner (animation)
var runner = Runner.create();
Runner.run(runner, engine);

//Mouse Constraint
var mouse = Mouse.create(render.canvas),
    mouseConstraint = MouseConstraint.create(engine, {
        mouse: mouse,
        constraint: {
            stiffness: 0.2,
            render: {
                visible: false
            }
        }
    });

World.add(world, mouseConstraint);

// keep the mouse in sync with rendering
render.mouse = mouse;

var allBodies = Matter.Composite.allBodies(world);
var newBall; 
var foundBall;
var mouseDownID = 0; 
var lastSize = 40; //size of most recently added ball
const maxSize = 300;
const minSize = 10;
var listeningID = 0;
var counter = 0;
var inflateFactor = 1.01;
var deflateFactor = 0.999;
var ground = Bodies.rectangle(window.innerWidth/2, window.innerHeight+15, window.innerWidth, 30, { isStatic: true });
World.add(world, [ground]);

//Update message, ball size
Events.on(engine, 'beforeUpdate', function(event) {
    
    lastSize *= inflateFactor;
    
    if (mouseDownID == 1 && lastSize < maxSize && !foundBall)    {
        Matter.Body.scale(newBall, inflateFactor, inflateFactor);
        document.getElementById("message").innerHTML = "Recording...";
    } else if (listeningID == 1){
        counter += 1;
        Matter.Body.scale(foundBall, deflateFactor, deflateFactor);
        
        document.getElementById("message").innerHTML = "Listening...";
    } else if (listeningID == 0) {
        counter = 0;
        
        if (person != null) document.getElementById("message").innerHTML = "Good morning, " + person;
    }
});

//Check hover on balls
Matter.Events.on(mouseConstraint, 'mousemove', function(event) {
    var bodies = Matter.Composite.allBodies(world);
    var foundPhysics = Matter.Query.point(bodies, event.mouse.position);
    foundBall = foundPhysics[0];
    
    if (foundBall && mouseDownID == 1) {
        listeningID = 1;
    } else {
        listeningID = 0;
    }
});

// Front-End File //
// grab microphone from mediaDevices library
navigator.mediaDevices.getUserMedia({audio: true}).then((stream) => {
  handlerFunction(stream);
});

// converting a blob url and sending it to a file
// https://stackoverflow.com/questions/60431835/how-to-convert-a-blob-url-to-a-audio-file-and-save-it-to-the-server
function handlerFunction(stream) {
  rec = new MediaRecorder(stream);
  let blob;
  let urlMP3;
    
    Events.on(mouseConstraint, 'mousedown', function(event) {
        
        mouseDownID = 1;

        //If mouse is pressed and not over a ball, add a new ball and record audio
        if (!foundBall) {

            //record audio
            record.disabled = true;
            record.style.backgroundColor = "blue";
            stopRecord.disabled = false;
            audioChunks = [];
            rec.start();

            //send data
            rec.ondataavailable = (e) => {
                audioChunks.push(e.data);

                if (rec.state == "inactive") {
                    blob = new Blob(audioChunks, {type: "audio/mpeg-3"});
                    recordedAudio.src = URL.createObjectURL(blob);
                    recordedAudio.controls = true;
                    recordedAudio.autoplay = true;
                    sendData(blob);
                }
            };

            //create ball
            newBall = Bodies.circle(event.mouse.position.x, event.mouse.position.y, 40, {
                render: {
                    fillStyle: colors[Math.floor(Math.random() * colors.length)]
                }
            });
            World.add(world, newBall);
        }
    });
}

Events.on(mouseConstraint, 'mouseup', function(event) {
    mouseDownID = 0;
    lastSize = 40;
    
    //stop recording
    record.disabled = false;
    stop.disabled = true;
    record.style.backgroundColor = "red";
    rec.stop();
});

function sendData(data) {
  // console.log(data);
  // send blob to the backend
  var xhr = new XMLHttpRequest();
  xhr.responseType = "blob";
  xhr.open("POST", "/sendBlob", true);
  xhr.setRequestHeader("Content-Type", "audio/mpeg-3");
  // xhr.setRequestHeader("Content-Type", "application/json");
  xhr.send(data);
}

// grab song-data onclick
// on-click, grab the id of the ball too.
// id should match the ID in the Google Drive
document.getElementById("getRecord").addEventListener("click", function () {
  // write function here to grab the id of the ball?..
  var mp3GET = "1w7NVMLk28X3gf_pXHiWGbiK6L8ok89UQ";
  getData(mp3GET);
});

function getData(id) {
  let request = new XMLHttpRequest();
  request.open("GET", `/grabMP3/${id}`);
  request.onreadystatechange = function () {
    if (request.readyState === XMLHttpRequest.DONE) {
      var status = request.status;
      if (status === 0 || (status >= 200 && status < 400)) {
        console.log(request.response);
      } else {
        console.log("bad request - backend");
      }
    }
  };
  request.send();
}