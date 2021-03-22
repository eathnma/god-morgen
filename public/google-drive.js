// GOOGLE DRIVE API
import fs from "fs";
import readline from "readline";
import {google} from "googleapis";

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

  handleFile(fileID, body, method) {
    var that = this;
    fs.readFile("credentials.json", (err, content) => {
      if (err) return console.log("Error loading client secret file:", err);
      //Authorize a client with credentials, then call the Google Drive API.
      //authorize(JSON.parse(content), listFiles);
      that.authorize(JSON.parse(content), method, fileID, body);
      // authorize(JSON.parse(content), uploadFile);
    });
  }

  // authorize ;.;
  authorize(credentials, callback, fileID, body) {
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
      callback(oAuth2Client, fileID, body); //list files and upload file
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

  // https://developers.google.com/drive/api/v3/create-file
  // upload file to the drive
  uploadFile(auth, fileID, body) {
    const drive = google.drive({version: "v3", auth});
    var fileMetadata = {
      name: fileID,
    };

    var media = {
      // if not, use "audio/mpeg3"
      mimeType: "audio/mpeg-3",
      body: fs.WriteStream(body),
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

  // https://developers.google.com/drive/api/v3/search-files#node.js
  // grab file from the drive
  getFile(auth, fileId, body) {
    const drive = google.drive({version: "v3", auth});
    drive.files.get(
      {
        fileId: fileId,
        fields: "*",
        // this field signals that it's ready to be downloaded
        // alt: "media",
      },
      (err, res) => {
        if (err) return console.log("The API returned an error: " + err);
        console.log(res.data);
      }
    );
  }
}
