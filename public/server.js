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
      // (name, blob, method)
      // newread is a buffer??
      googl.handleFile("url randomizer", newread, googl.uploadFile);
    }
  });
});

// grab mp3 from backend
app.get("/grabMP3/:id", (req, res) => {
  console.log("backend id: " + req.params.id);

  const file = googl.handleFile(req.params.id, "", googl.getFile);

  // pass in empty string and check drive for it
  // const file = googl.handleFile("", req, googl.listFiles);
  // console.log(file);
  // res.send(file);
});

//heroku deployment
server.listen(process.env.PORT || port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
