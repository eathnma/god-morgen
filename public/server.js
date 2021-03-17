import {Googl} from "./google-drive.js";
var googl = new Googl();

// run Backend Node Server
import path, {dirname} from "path";
const port = 1500;

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

// grab blob
app.post("/sendBlob", (req, res) => {
  console.log(req);
  googl.handleFile("screaming", req);
});

//heroku deployment
server.listen(process.env.PORT || port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
