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

  var reader = new FileReader();

  rec.ondataavailable = (e) => {
    audioChunks.push(e.data);
    if (rec.state == "inactive") {
      blob = new Blob(audioChunks, {type: "audio/mpeg-3"});
      // var buffer = new Buffer(blob, "binary");

      // CREATE URL for the mp3 blob
      urlMP3 = URL.createObjectURL(blob);
      recordedAudio.src = URL.createObjectURL(blob);
      recordedAudio.controls = true;
      recordedAudio.autoplay = true;

      // Send Data
      sendData(urlMP3);
      console.log("Sent: " + urlMP3);

      // reader.readAsDataURL(blob);
      // reader.onloadend = function () {
      //   var base64data = reader.result;
      //   // sendData :)
      //   sendData(base64data);
      // };
      // sendData(urlMP3);
    }
  };
}

function sendData(data) {
  // send blob to the backend
  var xhr = new XMLHttpRequest();
  xhr.open("POST", "/sendBlob", true);
  xhr.setRequestHeader("Content-Type", "application/octet-stream");
  xhr.send(data);
}

// grab song-data onclick
// on-click, grab the id of the ball too.
// id should match the ID in the Google Drive
document.getElementById("getRecord").addEventListener("click", function () {
  var zion = "ethan.jpg";
  getData(zion);
});

// retrieve data
function getData(id) {
  // retrieve google code from the backend on button click
  let request = new XMLHttpRequest();
  request.open("GET", `/grabMP3/${id}`);

  // listen for
  request.onreadystatechange = function () {
    // In local files, status is 0 upon success in Mozilla Firefox
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
//
