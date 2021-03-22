import {Googl} from "./google-drive.js";
var googl = new Googl();

// run Backend Node Server
import path, {dirname} from "path";
const port = 1500;

// import express from "../node_modules/express/index.js";
import express from "express";
const app = express();

import ejs from "ejs";
import {fileURLToPath} from "url";
import bodyParser from "body-parser";

const __dirname = dirname(fileURLToPath(import.meta.url));

// socket.io code
import http from "http";
const server = http.createServer(app);

// const __dirname = path.resolve(path.dirname(""));

app.use(bodyParser.urlencoded());

app.use(express.static("public"));
app.use("/js", express.static(__dirname + "/js"));

app.set("views", path.join(__dirname, "/views"));
app.engine("html", ejs.renderFile);

app.get("/", (req, res) => {
  res.sendFile("/views/index.html", {root: __dirname});
});

// grab blob from frontend & send to Google Drive
app.post("/sendBlob", (req, res) => {
  console.log(req);
  // file handling - uploading file
  // googl.handleFile("screaming", req, googl.uploadFile);
});

// grab mp3 from backend
app.get("/grabMP3/:id", (req, res) => {
  console.log(req.params.id);

  // pass in filled string
  const file = googl.handleFile(req.params.id, req, googl.getFile);

  // console.log(file);

  // pass in empty string and check drive for it
  // const file = googl.handleFile("", req, googl.listFiles)

  // var test = "TEST";
  res.send(file);
});

//heroku deployment
server.listen(process.env.PORT || port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
