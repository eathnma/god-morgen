import {Googl} from "./google-drive.js";
var googl = new Googl();

// run Backend Node Server
import path, {dirname} from "path";
const port = 1500;

import express from "express";
const app = express();

import ejs from "ejs";
import {fileURLToPath} from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

// socket.io code
import http from "http";
import body_parser from "body-parser";
import btoa from "btoa";

const server = http.createServer(app);

app.use(body_parser({limit: "100mb"}));

app.use(express.static("public"));
app.use("/js", express.static(__dirname + "/js"));

app.use(express.json());

app.set("views", path.join(__dirname, "/views"));
app.engine("html", ejs.renderFile);

app.get("/", (req, res) => {
  res.sendFile("/views/index.html", {root: __dirname});
});

// // grab blob
app.post("/sendBlob", (req, res) => {
  req.on("readable", function () {
    var newread = req.read();
    if (newread != null) {
      googl.handleFile("url randomizer", newread, googl.uploadFile);
    }
  });
});

// grab mp3 from backend
app.get("/grabMP3/:id", async (req, res) => {
  console.log("backend id: " + req.params.id);

  res.setHeader("Content-Type", "application/octet-binary");

  try {
    var file = await googl.handleFileGet(req.params.id);
    console.log(arrayBufferToBase64(file));
    // const utf8str = arrayBufferToString(file);
    // arraybuffer to uint8array
    // var uint8 = new Uint8Array(file);
    // var soundArray = Array.from(uint8);
    // console.log(uint8);
    // console.log(uint8);
    console.log(toBuffer(file));
    res.send(toBuffer(file));
  } catch (e) {
    console.log(e);
  }
});

function toBuffer(ab) {
  var buf = Buffer.alloc(ab.byteLength);
  var view = new Uint8Array(ab);
  for (var i = 0; i < buf.length; ++i) {
    buf[i] = view[i];
  }
  return buf;
}

function arrayBufferToBase64(buffer) {
  var binary = "";
  var bytes = new Uint8Array(buffer);
  var len = bytes.byteLength;
  for (var i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

//heroku deployment
server.listen(process.env.PORT || port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
