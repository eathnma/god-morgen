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

  // send stream of data on start click
  document.getElementById("record").addEventListener("click", function () {
    rec.ondataavailable = (e) => {
      audioChunks.push(e.data);
      if (rec.state == "inactive") {
        blob = new Blob(audioChunks, {type: "audio/mpeg-3"});
        recordedAudio.src = URL.createObjectURL(blob);
        recordedAudio.controls = true;
        recordedAudio.autoplay = true;

        // var myObj = {
        //   blob: blob, // type: audio/mpeg-3
        //   // name: "Ethan", // pass in file-name here?
        // };

        // console.log(blob);
        // stringify the blob
        // sendData(JSON.stringify(myObj));
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
  // xhr.setRequestHeader("Content-Type", "application/json");
  xhr.send(data);
}

// grab song-data onclick
// on-click, grab the id of the ball too.
// id should match the ID in the Google Drive
document.getElementById("getRecord").addEventListener("click", function () {
  // write function here to grab the id of the ball?..
  var mp3GET = "1HTeKG1XVix1llWC1aaSymmt99xWvo026";
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
