var person;
var overlay = document.getElementById("onboarding");

function closeOverlay() {
  person = document.getElementById("name").value;
  overlay.remove();
}

var d = new Date();
var time = d.getHours();
document.getElementById("date").innerHTML = d.toLocaleDateString();
document.getElementById("time").innerHTML = d.toLocaleTimeString();

var names = [
  "Ashley",
  "Brendan",
  "Carman",
  "Darya",
  "Ethan",
  "Frank",
  "Giorgia",
  "Hason",
  "Ian",
  "Justin",
  "Kelly",
  "Lucy",
  "Melanie",
  "Norman",
  "Ola",
  "Peggy",
  "Quinn",
  "Rodney",
  "Samantha",
  "Tiffany",
  "Vincent",
  "Winnie",
  "Yan",
  "Zoe",
];

// FILE ID's from the Google Drive
var fileIDs = [
  "19160KI4m4b778gBssHsrPkJK36K1ZhHx",
  "1uK6pHfZPc89QpFLM8IernI0d2BaGFP7h",
  "13Wmlah6tygrjrTUU-109VTB6xi584q1o",
  "1kiwvE5f2e0aoPwYPQyZU9FzdhFFS44DS",
  "1qQ7w61IaSddSs_0m1BGntVGAmzadKAxu",
  "1hQD3-Yjo7r55Nh9TN874j1JF6tJ06-99",
  "1SeNcK0poXQEoM8i1umDBFcx_nyNCig8a",
  "1p1aW6GNhz-DfwigcHvwFIVBvrmJtEdGt",
  "1N_M3t-pyo3cRT8BlJ2RCMUINKrDFz2nN",
  "1J2FomX8_Rhm8Vf62YAHYQmuimg5X7qg0",
  "1jVRrDyDuqLs-1Ey1aCHwPikOkDnx_ikb",
  "1sIPsFdjlTTaa3ns3mPfYt7vmVjmeGNWZ",
];

var blue = "rgb(88, 168, 253)";
var green = "rgb(32, 190, 114)";
var indigo = "rgb(90, 96, 254)";
var mustard = "rgb(248, 188, 72)";
var orange = "rgb(248, 84, 48)";
var plum = "rgb(143, 23, 97)";

var colors = [blue, green, indigo, mustard, orange, plum];

var bodies = [];

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
    background: "#fcfcfc",
  },
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
        visible: false,
      },
    },
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
var inflateFactor = 1.01;
var deflateFactor = 0.999;
var balls = [];
const maxTime = 15000;
var hitBall;
var selectedBall;


var topWall = Bodies.rectangle(
  window.innerWidth / 2,
  -25,
  window.innerWidth,
  50,
  {
    isStatic: true,
    render: {
      fillStyle: "white",
    },
  }
);

var leftWall = Bodies.rectangle(
  -25,
  window.innerHeight / 2,
  50,
  window.innerHeight,
  {
    isStatic: true,
    render: {
      fillStyle: "white",
    },
  }
);

var rightWall = Bodies.rectangle(
  window.innerWidth + 25,
  window.innerHeight / 2,
  50,
  window.innerHeight,
  {
    isStatic: true,
    render: {
      fillStyle: "white",
    },
  }
);

var bottomWall = Bodies.rectangle(
  window.innerWidth / 2,
  window.innerHeight + 25,
  window.innerWidth,
  50,
  {
    isStatic: true,
    render: {
      fillStyle: "white",
    },
  }
);

//walls
World.add(world, [topWall, leftWall, rightWall, bottomWall]);

window.addEventListener("resize", function () {
  render.width = window.innerWidth;
  render.height = window.innerHeight;
  Matter.Body.setPosition(topWall, {x: window.innerWidth / 2, y: -25});
  Matter.Body.setPosition(leftWall, {x: -25, y: window.innerHeight / 2});
  Matter.Body.setPosition(rightWall, {
    x: window.innerWidth + 25,
    y: window.innerHeight / 2,
  });
  Matter.Body.setPosition(bottomWall, {
    x: window.innerWidth / 2,
    y: window.innerHeight + 25,
  });
});

class Ball {
  constructor(timeStamp, name, x, y, size, id) {
    this.timeStamp = timeStamp;
    this.name = name;
    this.x = x;
    this.y = y;
    this.size = size;
    this.body = Bodies.circle(this.x, this.y, this.size, {
      render: {
        fillStyle: colors[Math.floor(Math.random() * colors.length)],
        lineWidth: 1,
        text: {
          content: this.name,
          size: 16,
        },
      },
    });
    this.id = id;

    World.add(world, [this.body]);
  }

  checkHit(point) {
    var bodies = Matter.Composite.allBodies(world);
    var hitBodies = Matter.Query.point(bodies, point);
    if (hitBodies[0] == this.body) {
      return true;
    } else {
      return false;
    }
  }

  setOpacity(val) {
    this.body.render.opacity = val;
  }

  timeStamp() {
    return this.timeStamp;
  }

  remove() {
    Matter.Composite.remove(world, this.body);
  }

  inflate() {
    Matter.Body.scale(this.body, inflateFactor, inflateFactor);
  }

  deflate() {
    Matter.Body.scale(this.body, deflateFactor, deflateFactor);
  }

  record(stream) {}

  body() {
    return this.body;
  }
}

function changeOpacity(ball) {
  let originalTime = ball.timeStamp;
  let timeDiff = Date.now() - originalTime;
  let opacity = (1 / maxTime) * timeDiff;
  ball.setOpacity(1 - opacity);
  if (1 - opacity < 0 || 1 - opacity > 1) {
    ball.remove();
  }
}

//Update message, ball size
Events.on(engine, "beforeUpdate", function (event) {
    console.log(selectedBall);
  balls.forEach(changeOpacity);
console.log(lastSize);
  lastSize *= inflateFactor;

  if (mouseDown && lastSize < maxSize && selectedBall == null) {
    newBall.inflate();
    document.getElementById("message").innerHTML = "Recording...";
  } else if (mouseDown && selectedBall) {
    selectedBall.deflate();
    document.getElementById("message").innerHTML = "Listening...";
  } else if (!mouseDown) {
    if (person != null)
      if (time > 18) {
        document.getElementById("message").innerHTML =
          "Good evening, " + person;
      } else if (time > 12) {
        document.getElementById("message").innerHTML =
          "Good afternoon, " + person;
      } else if (time > 5) {
        document.getElementById("message").innerHTML =
          "Good morning, " + person;
      } else if (time >= 0) {
        document.getElementById("message").innerHTML = "Good night, " + person;
      } else {
        document.getElementById("message").innerHTML = "Hello, " + person;
      }
  }
});

// Front-End File //
window.onload = init;
var context; // Audio context
var buf; // Audio buffer

var getRecord = document.getElementById("getRecord");

function init() {
  // create balls
  for (var i = 0; i < 6; i++) {
    balls.push(
      new Ball(
        // Date.now() + Math.random() * 20000,
        Date.now(),
        names[Math.floor(Math.random() * names.length)],
        Math.random() * window.innerWidth,
        Math.random() * window.innerHeight,
        60 + Math.random() * 100,
        fileIDs[Math.floor(Math.random() * fileIDs.length)]
      )
    );
  }

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

var mouseDown = false;

function handlerFunction(stream) {
  rec = new MediaRecorder(stream);
  let blob;
  let urlMP3;

  Events.on(mouseConstraint, "mousedown", function (event) {
    mouseDown = true;

    for (var i = 0; i < balls.length; i++) {
      let ball = balls[i];
      if (ball.checkHit(event.mouse.position)) {
        selectedBall = balls[i];
        hitBall = true;
        break;
      } else {
        hitBall = false;
        console.log("false");
      }
    }

    if (hitBall === true) {
      // pass in ID to the backend
      console.log(selectedBall.id);
      getData(selectedBall.id);
    } else {
      console.log("record audio");
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

      newBall = new Ball(
        Date.now(),
        person,
        event.mouse.position.x,
        event.mouse.position.y,
        60,
        "placeholder"
      );
      balls.push(newBall);
    }
  });
}

Events.on(mouseConstraint, "mouseup", function (event) {
    mouseDown = false;
  mouseDownID = 0;
  lastSize = 40;

  if (selectedBall != null) {
    selectedBall.remove();
    console.log("mouseUP");
  }
  //stop recording
  record.disabled = false;
  stop.disabled = true;
  record.style.backgroundColor = "red";

  // recording
  if (rec.state != "inactive") rec.stop();
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

  context.decodeAudioData(arrayBuffer, function (buffer) {
    buf = buffer;
    playHandler();
  });
}

function playHandler() {
  var source = context.createBufferSource();
  // Create a source node from the buffer
  source.buffer = buf;
  // Connect to the final output node (the speakers)
  source.connect(context.destination);
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
