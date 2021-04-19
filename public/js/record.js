var person;
var overlay = document.getElementById("onboarding");

function closeOverlay(){
    person = document.getElementById("name").value;
    overlay.remove();
}

var blue = 'rgb(88, 168, 253)';
var green = 'rgb(32, 190, 114)';
var indigo = 'rgb(90, 96, 254)';
var mustard = 'rgb(248, 188, 72)';
var orange = 'rgb(248, 84, 48)';
var plum = 'rgb(143, 23, 97)';

var colors = [blue, green, indigo, mustard, orange, plum];
var names = ["Ashley", "Brendan", "Carman", "Darya", "Ethan", "Frank", "Giorgia", "Hason", "Ian", "Justin", "Kelly", "Lucy", "Melanie", "Norman", "Ola", "Peggy", "Quinn", "Rodney", "Samantha", "Tiffany", "Vincent", "Winnie", "Yan", "Zoe"]

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
        background: '#fcfcfc'
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
const minSize = 60;
var listeningID = 0;
var counter = 0;
var inflateFactor = 1.01;
var deflateFactor = 0.999;
var balls = [];
const maxTime = 15000;


var topWall = Bodies.rectangle(window.innerWidth/2, -25, window.innerWidth, 50, { 
    isStatic: true, 
    render: { 
        fillStyle: 'white',
    }
});
    
var leftWall = Bodies.rectangle(-25, window.innerHeight/2, 50, window.innerHeight, { 
    isStatic: true, 
    render: { 
        fillStyle: 'white' 
    }
});
    
var rightWall = Bodies.rectangle(window.innerWidth + 25, window.innerHeight/2, 50, window.innerHeight, { 
    isStatic: true,
    render: { 
        fillStyle: 'white' 
    }
});
    
var bottomWall = Bodies.rectangle(window.innerWidth/2, window.innerHeight+25, window.innerWidth, 50, { 
    isStatic: true, 
    render: { 
        fillStyle: 'white' 
    }
});

//walls
World.add(world, [topWall, leftWall, rightWall, bottomWall]);

window.addEventListener("resize", function () {
    render.width = window.innerWidth;
    render.height = window.innerHeight;
    Matter.Body.setPosition(topWall, {x: window.innerWidth/2, y: -25});
    Matter.Body.setPosition(leftWall, {x: -25, y: window.innerHeight/2});
    Matter.Body.setPosition(rightWall, {x: window.innerWidth + 25, y: window.innerHeight/2});
    Matter.Body.setPosition(bottomWall, {x: window.innerWidth/2, y: window.innerHeight+25});
});

class Ball {
    constructor(timeStamp, name, x, y, size, colour) {
        this.timeStamp = timeStamp;
        this.name = name;
        this.x = x;
        this.y = y;
        this.size = size;
        this.colour = colour;
        this.body = Bodies.circle(this.x, this.y, this.size, {
            render: {
                fillStyle: this.colour,
                lineWidth: 1,
                text: {
                    content: this.name,
                    size: 16
                }
            }
        });
        
        World.add(world, [this.body]);
    }
    
    setOpacity(val){
        this.body.render.opacity = val;
    }
    
    timeStamp(){
        return this.timeStamp;
    }
    
    remove(){
        Matter.Composite.remove(world, this.body);
    }
}

window.onload = function(){
    for (var i = 0; i < 4; i++) {
        balls.push(new Ball(Date.now(), names[Math.floor(Math.random() * names.length)], Math.random() * window.innerWidth, Math.random() * window.innerHeight, 60 + (Math.random() * 150), 'black'));
    }
}

function changeOpacity(ball){
    let originalTime = ball.timeStamp;
    let timeDiff = Date.now() - originalTime;
    let opacity = (1/maxTime) * timeDiff;
    ball.setOpacity(1-opacity);
    console.log(1-opacity);
    if ((1-opacity) < 0 || (1-opacity)>1) {
        ball.remove();
    }
}

//Update message, ball size
Events.on(engine, 'beforeUpdate', function(event) {
    balls.forEach(changeOpacity);
    
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
    console.log("person: " + person);
});
//
//const cursor = document.querySelector(".cursor");
//
//function moveMouse(e) {
//    cursor.style.top = (e.pageY - 30) + "px";
//    cursor.style.left = (e.pageX - 30)+ "px";
//}

//window.addEventListener("mousemove", moveMouse);

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
//    
//    cursor.style.top = (event.mouse.position.y - 30) + "px";
//    cursor.style.left = (event.mouse.position.x - 30)+ "px";
});

// Front-End File //

window.onload = init;
var context; // Audio context
var buf; // Audio buffer

var getRecord = document.getElementById("getRecord");

function init() {
  if (!window.AudioContext) {
    if (!window.webkitAudioContext) {
      alert(
        "Your browser does not support any AudioContext and cannot play back this audio."
      );
      return;
    }
    window.AudioContext = window.webkitAudioContext;
  }

  context = new AudioContext();
}

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
            newBall = Bodies.circle(event.mouse.position.x, event.mouse.position.y, 60, {
                render: {
                    
                    fillStyle: 'black',
                    
                    text: {
                        content: person,
                        size: 16
                    }
                }
            });
            World.add(world, newBall);
//            newBall = new Ball(Date.now(), person, event.mouse.position.x, event.mouse.position.y, 60, 'white')
//            balls.push(newBall);
        }
    });
}

Events.on(mouseConstraint, 'mouseup', function(event) {
    mouseDownID = 0;
    lastSize = 40;
    console.log("mouseup");
    //stop recording
    record.disabled = false;
    stop.disabled = true;
    record.style.backgroundColor = "red";
    
    if(rec.state != 'inactive') rec.stop();
});

function sendData(data) {
  // console.log(data);
  // send blob to the backend
  var xhr = new XMLHttpRequest();
  xhr.responseType = "blob";
  xhr.open("POST", "/sendBlob", true);
  xhr.setRequestHeader("Content-Type", "audio/mpeg-3");
  xhr.send(data);
}

// grab song-data onclick
// on-click, grab the id of the ball too.
// id should match the ID in the Google Drive
getRecord.onclick = function () {
  var mp3GET = "1Veex6iLEGRTXrNZM3IfLdcwCG63MsGGs";
  getData(mp3GET);
};

function getData(id) {
  let request = new XMLHttpRequest();
  request.open("GET", `/grabMP3/${id}`);

  request.responseType = "arraybuffer";

  // https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/Sending_and_Receiving_Binary_Data
  // https://www.generacodice.com/en/articolo/2270907/javascript+readAsArrayBuffer+returns+empty+Array+Buffer
  request.onreadystatechange = function () {
    if (request.readyState === XMLHttpRequest.DONE) {
      var status = request.status;

      if (status === 0 || (status >= 200 && status < 400)) {
        var arrayBuffer = request.response;
        // var atobArray = window.atob(arrayBuffer);
        // var uint8 = new Uint8Array(arrayBuffer);

        console.log(arrayBuffer);

        var byteArray = new Uint8Array(arrayBuffer);
        // console.log(arrayBuffer);
        var soundArray = Array.from(byteArray);

        // for (var i = 0; i < byteArray.byteLength; i++) {
        //   // do something with each byte in the array
        // }

        playByteArray(soundArray);
      } else {
        console.log("bad request - backend");
      }
    }
  };
  request.send();
}

var JsonToArray = function (json) {
  var str = JSON.stringify(json, null, 0);
  var ret = new Uint8Array(str.length);
  for (var i = 0; i < str.length; i++) {
    ret[i] = str.charCodeAt(i);
  }
  return ret;
};

// is this a byteArray
function playByteArray(byteArray) {
  var arrayBuffer = new ArrayBuffer(byteArray.length);
  var bufferView = new Uint8Array(arrayBuffer);
  for (i = 0; i < byteArray.length; i++) {
    bufferView[i] = byteArray[i];
  }
  // console.log(arrayBuffer);
  // console.log(bufferView);

  context.decodeAudioData(arrayBuffer, function (buffer) {
    buf = buffer;
    play();
  });
  // var buffer = new Uint8Array(bytes.length);
  // buffer.set(new Uint8Array(bytes), 0);

  // context.decodeAudioData(buffer.buffer, play);
}

function play() {
  // Create a source node from the buffer
  var source = context.createBufferSource();
  source.buffer = buf;
  // Connect to the final output node (the speakers)
  source.connect(context.destination);
  // Play immediately
  source.start(0);
}

// start recording
record.onclick = (e) => {
  console.log("I was clicked");
  record.disabled = true;
  record.style.backgroundColor = "blue";
  stopRecord.disabled = false;
  audioChunks = [];
  rec.start();
};

// stop recording
stopRecord.onclick = (e) => {
  console.log("I was clicked");
  record.disabled = false;
  stop.disabled = true;
  record.style.backgroundColor = "red";
  rec.stop();
};
