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

  rec.ondataavailable = (e) => {
    audioChunks.push(e.data);
    if (rec.state == "inactive") {
      blob = new Blob(audioChunks, {type: "audio/mpeg-3"});
      urlMP3 = URL.createObjectURL(blob);
      recordedAudio.src = URL.createObjectURL(blob);
      recordedAudio.controls = true;
      recordedAudio.autoplay = true;
      sendData(blob);
    }
  };

  // console.log(blob);
  // console.log(urlMP3);
}

function sendData(data) {
  console.log(data);
  // send blob to the backend
  var xhr = new XMLHttpRequest();
  xhr.open("POST", "/sendBlob", true);
  // xhr.setRequestHeader('Content-Type', 'application/vnd.google-apps.audio');
  //xhr.setRequestHeader("Content-Type", "audio/mpeg-3");
  xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
  xhr.send(data);
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
