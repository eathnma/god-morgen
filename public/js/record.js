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
