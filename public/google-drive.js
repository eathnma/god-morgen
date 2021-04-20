// GOOGLE DRIVE API
import fs from "fs";
import {promises} from "fs";
import readline from "readline";
import {google} from "googleapis";

import http from "http";
import {default as fsWithCallbacks} from "fs";
const fsSomething = fsWithCallbacks.promises;

//Drive API, v3
//https://www.googleapis.com/auth/drive	See, edit, create, and delete all of your Google Drive files
//https://www.googleapis.com/auth/drive.file View and manage Google Drive files and folders that you have opened or created with this app
//https://www.googleapis.com/auth/drive.metadata.readonly View metadata for files in your Google Drive
//https://www.googleapis.com/auth/drive.photos.readonly View the photos, videos and albums in your Google Photos
//https://www.googleapis.com/auth/drive.readonly See and download all your Google Drive files
// If modifying these scopes, delete token.json.
const SCOPES = ["https://www.googleapis.com/auth/drive"];
// The file token.json stores the user's access and refresh tokens, and is
// created automatically when the authorization flow completes for the first time.

const TOKEN_PATH = "token.json";

/**
 * Get and store new token after prompting for user authorization, and then
 * execute the given callback with the authorized OAuth2 client.
 * @param {google.auth.OAuth2} oAuth2Client The OAuth2 client to get token for.
 * @param {getEventsCallback} callback The callback for the authorized client.
 */

function getAccessToken(oAuth2Client, callback) {
  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: "offline",
    scope: SCOPES,
  });
  console.log("Authorize this app by visiting this url:", authUrl);
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  rl.question("Enter the code from that page here: ", (code) => {
    rl.close();
    oAuth2Client.getToken(code, (err, token) => {
      if (err) return console.error("Error retrieving access token", err);
      oAuth2Client.setCredentials(token);
      // Store the token to disk for later program executions
      fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
        if (err) return console.error(err);
        console.log("Token stored to", TOKEN_PATH);
      });
      callback(oAuth2Client);
    });
  });
}

//to call from the server
export class Googl {
  constructor() {
    // Load client secrets from a local file.
  }

  // handling files
  async handleFileGet(name) {
    var that = this;
    var handleByte;
    var getFrontend = await fsSomething
      .readFile("credentials.json")
      .then((content) => {
        //Authorize a client with credentials, then call the Google Drive API.
        handleByte = that.authorizeGet(JSON.parse(content), name);
        // console.log(handleByte);
        return handleByte;
      })
      .catch((err) => {
        if (err) return console.log("Error loading client secret file:", err);
      });

    // console.log(getFrontend);
    return getFrontend;
  }

  async authorizeGet(credentials, name) {
    var responseLayer;
    var test;
    var that = this;
    const {client_secret, client_id, redirect_uris} = credentials.installed;
    const oAuth2Client = new google.auth.OAuth2(
      client_id,
      client_secret,
      redirect_uris[0]
    );

    // Check if we have previously stored a token.
    responseLayer = await fsSomething.readFile(TOKEN_PATH).then((token) => {
      // console.log(token);
      oAuth2Client.setCredentials(JSON.parse(token.toString()));

      return that
        .getFile(oAuth2Client, name)
        .then((data) => {
          // console.log(data);
          return data;
        })
        .catch((err) => {
          if (err) return getAccessToken(oAuth2Client, this.handleFile);
        });
    });
    return responseLayer;
  }

  handleFileGetList(method) {
    var that = this;
    fs.readFile("credentials.json", (err, content) => {
      if (err) return console.log("Error loading client secret file:", err);
      //Authorize a client with credentials, then call the Google Drive API.
      that.authorize(JSON.parse(content), method);
    });
  }

  handleFile(name, blob, method) {
    var that = this;
    fs.readFile("credentials.json", (err, content) => {
      if (err) return console.log("Error loading client secret file:", err);
      //Authorize a client with credentials, then call the Google Drive API.
      that.authorize(JSON.parse(content), method, name, blob);
    });
    // return handleByte;
  }

  // authorize ;.;
  authorize(credentials, callback, name, blob) {
    var bytes;
    const {client_secret, client_id, redirect_uris} = credentials.installed;
    const oAuth2Client = new google.auth.OAuth2(
      client_id,
      client_secret,
      redirect_uris[0]
    );

    // Check if we have previously stored a token.
    fs.readFile(TOKEN_PATH, (err, token) => {
      if (err) return getAccessToken(oAuth2Client, callback);
      oAuth2Client.setCredentials(JSON.parse(token));

      callback(oAuth2Client, name, blob);
    });
  }

  listFiles(auth, useless1, useless2) {
    const drive = google.drive({version: "v3", auth});

    function getList(drive, pageToken) {
      drive.files.list(
        {
          // corpora: "user",
          // pageSize: 10,
          // q: "name='hello'",
          // pageToken: pageToken ? pageToken : "",
          // fields: "nextPageToken, files(*)",
        },
        (err, res) => {
          if (err) return console.log("The API returned an error: " + err);
          const files = res.data.files;
          if (files.length) {
            console.log("Files:");
            // processList(files);
            console.log(files);
            if (res.data.nextPageToken) {
              getList(drive, res.data.nextPageToken);
            }

            // files.map((file) => {
            //     console.log(`${file.name} (${file.id})`);
            // });
          } else {
            console.log("No files found.");
          }
        }
      );
    }

    getList(drive, "");
  }

  uploadFile(auth, name, blob) {
    const drive = google.drive({version: "v3", auth});
    var fileMetadata = {
      name: `${name}.mp3`,
    };
    // var buf = Buffer.from(blob, 'base64');
    // console.log("AEEE" + typeof(blob);
    var filepath = "file.mp3";

    try {
      fs.writeFileSync(filepath, blob);
    } catch (e) {
      console.log("Cannot write file ", e);
    }
    var media = {
      // if not, use "audio/mpeg3"
      mimeType: "audio/mp3",
      body: fs.createReadStream(filepath),
    };

    drive.files.create(
      {
        resource: fileMetadata,
        media: media,
        fields: "id",
      },
      function (err, res) {
        if (err) {
          // Handle error
          console.log(err);
        } else {
          console.log("File Id: ", res.data.id);
        }
      }
    );
  }

  async getFile(auth, fileId) {
    var data;
    const drive = google.drive({version: "v3", auth});
    var grab = drive.files.get(
      {
        fileId: fileId,
        alt: "media",
      },
      {
        responseType: "arraybuffer",
      }
    );

    var a = grab
      .then((res) => {
        // grabbing arraybuffer mp3?
        data = res.data;
        // console.log(data);
        return data;
      })
      .catch((err) => {
        // print out error statement
        console.log(err);
      });
    return a;
  }
}
