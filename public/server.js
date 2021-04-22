// Grab Google class from google-drive JS
// Google-drive.js grabs data from the google drive api
import {Googl} from "./google-drive.js";
var googl = new Googl();

// run backend Node Server
import path, {dirname} from "path";
const port = 1501;

import express from "express";
const app = express();

// ejs as a help library to help package static files for the backend
import ejs from "ejs";
import {fileURLToPath} from "url";
const __dirname = dirname(fileURLToPath(import.meta.url));

// libraries to help with client -> server data transfer
// these libraries are specific for transferring binary data
import http from "http";
import body_parser from "body-parser";
import btoa from "btoa";

const server = http.createServer(app);

app.use(body_parser({limit: "100mb"}));

// set main directory to public
app.use(express.static("public"));
app.use("/js", express.static(__dirname + "/js"));
app.use(express.json());

// set views.html as the main hosted file
app.set("views", path.join(__dirname, "/views"));
app.engine("html", ejs.renderFile);
app.get("/", (req, res) => {
  res.sendFile("/views/index.html", {root: __dirname});
});

// send blob from front-end to the google drive
// line to send blob is on (line 391) in record.js
app.post("/sendBlob", (req, res) => {
  req.on("readable", function () {
    var newread = req.read();
    if (newread != null) {
      googl.handleFile("url randomizer", newread, googl.uploadFile);
    }
  });
});

// grab a list of file ID's from the drive
// mostly used for debugging
// googl.handleFileGetList(googl.listFiles);

// grab mp3 from backend
app.get("/grabMP3/:id", async (req, res) => {
  console.log("backend id: " + req.params.id);

  // set content type of data to octet-binary
  res.setHeader("Content-Type", "application/octet-binary");

  // Documentation of what I tried
  // arraybuffer -> to Base 64 file
  // arraybuffer -> uint8Array -> byte array
  // arraybuffer -> buffer -> uint8Array -> byte array
  // arraybuffer -> string

  // What ended up working
  // arraybuffer -> buffer
  try {
    var file = await googl.handleFileGet(req.params.id);
    res.send(toBuffer(file));
  } catch (e) {
    console.log(e);
  }
});

// takes type arraybuffer and creates a buffer
function toBuffer(ab) {
  var buf = Buffer.alloc(ab.byteLength);
  var view = new Uint8Array(ab);
  for (var i = 0; i < buf.length; ++i) {
    buf[i] = view[i];
  }
  return buf;
}

// host webserver to localhost
server.listen(process.env.PORT || port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
