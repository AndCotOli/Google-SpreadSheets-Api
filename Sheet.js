const { google } = require("googleapis");
const fs = require("fs");
const readline = require("readline");
class Sheet {
  _authorize(callback) {
    const PATH = "token.json";

    fs.readFile("secret.json", (err, content) => {
      if (err) return console.error(`Error loading the secrets!\n${err}`);

      const credentials = JSON.parse(content);

      const { client_secret, client_id, redirect_uris } = credentials.installed;
      const oAuthClient = new google.auth.OAuth2(
        client_id,
        client_secret,
        redirect_uris[0]
      );

      fs.readFile(PATH, (err, token) => {
        if (err) return this._generateToken(oAuthClient, callback);
        oAuthClient.setCredentials(JSON.parse(token));
        callback(oAuthClient);
      });
    });
  }

  _generateToken(oAuthClient, callback) {
    const PATH = "token.json";
    const SCOPES = ["https://www.googleapis.com/auth/spreadsheets"];
    const authUrl = oAuthClient.generateAuthUrl({
      acces_type: "ofline",
      scope: SCOPES
    });
    console.log(
      `You need to Authorize this app!\nPlease, enter this url to do it: ${authUrl}`
    );
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });

    rl.question("Enter the code here: ", code => {
      rl.close();
      oAuthClient.getToken(code, (err, token) => {
        if (err)
          return console.error(
            `An error ocurred while getting the Auth code\n${err}`
          );
        oAuthClient.setCredentials(token);
        console.log(
          `Your token will be saved on ${PATH} for future program executions`
        );
        fs.writeFile(PATH, JSON.stringify(token), err => {
          if (err) return console.error(err);
          console.log("Token stored to: ", PATH);
        });
        callback(oAuthClient);
      });
    });
  }

  _read(auth) {
    const sheets = google.sheets({ version: "v4", auth });
    sheets.spreadsheets.values.get(
      {
        spreadsheetId: "1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms",
        range: "Class Data!A2:E"
      },
      (err, res) => {
        if (err) return console.log("The API returned an error: " + err);
        const rows = res.data.values;
        if (rows.length) {
          console.log("Name, Major:");
          // Print columns A and E, which correspond to indices 0 and 4.
          rows.map(row => {
            console.log(`${row[0]}, ${row[4]}`);
          });
        } else {
          console.log("No data found.");
        }
      }
    );
  }

  read() {
    return this._authorize(this._read);
  }
}

module.exports = Sheet;
