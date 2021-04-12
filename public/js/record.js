// Front-End File //

// import {response} from "express";

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

  // send stream of data on start click
  document.getElementById("record").addEventListener("click", function () {
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
  });
}

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
document.getElementById("getRecord").addEventListener("click", function () {
  // write function here to grab the id of the ball?..
  var mp3GET = "1oc_9wTWNZDaH_BIpzX_L891wxP2jUnTn";
  getData(mp3GET);
});

function getData(id) {
  let request = new XMLHttpRequest();
  request.open("GET", `/grabMP3/${id}`);

  request.send();

  request.responseType = "arrayBuffer";

  // https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/Sending_and_Receiving_Binary_Data
  request.onreadystatechange = function () {
    if (request.readyState === XMLHttpRequest.DONE) {
      var status = request.status;
      if (status === 0 || (status >= 200 && status < 400)) {
        // var arrayBuffer = new Uint8Array();
        // response.arrayBuffer().then;
        var uint8array = new TextEncoder().encode(request.response);
        // var stringMp3 = uint8arrayToStringMethod(uint8array);
        console.log(uint8Array);
        // playByteArray(uint8array);
        // playByteArray(request.response);
      } else {
        console.log("bad request - backend");
      }
    }
  };
}

// methods from audio buffer
window.onload = init;
var context; // Audio context
var buf; // Audio buffer

function uint8arrayToStringMethod(myUint8Arr) {
  return String.fromCharCode.apply(null, myUint8Arr);
}

function readAudioFile(file) {
  return new Response(file).arrayBuffer();
}

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

function playByteArray(byteArray) {
  var arrayBuffer = new ArrayBuffer(byteArray.length);
  var bufferView = new Uint8Array(arrayBuffer);
  for (i = 0; i < byteArray.length; i++) {
    bufferView[i] = byteArray[i];
  }

  context.decodeAudioData(arrayBuffer, function (buffer) {
    buf = buffer;
    play();
  });
}

// Play the loaded file
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
