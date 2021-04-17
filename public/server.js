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

// helps to import from
import bufferify from "json-bufferify";

const server = http.createServer(app);

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

  try {
    var file = await googl.handleFileGet(req.params.id);
    var enc = new TextDecoder("utf-8");

    // console.log(file);
    // console.log(enc.decode(file));
    var decodedString = new TextDecoder().decode(file);
    // console.log(decodedString);

    res.send(decodedString);
  } catch (e) {
    console.log(e);
  }
});

//heroku deployment
server.listen(process.env.PORT || port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
