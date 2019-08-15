const fs = require("fs");
const readline = require("readline");
const { google } = require("googleapis");

const SCOPES = ["https://www.googleapis.com/auth/spreadsheets.readonly"];
const PATH = "token.json";

function getToken() {
  fs.readFile("secret.json", (err, content) => {
    if (err) return console.error(`Error loading the secrets!\n${err}`);

    authorize(JSON.parse(content));
  });
}

function authorize(credentials) {
  const { client_secret, client_id, redirect_uris } = credentials.installed;
  const oAuthClient = new google.auth.OAuth2(
    client_id,
    client_secret,
    redirect_uris[0]
  );

  fs.readFile(PATH, (err, token) => {
    if (err) return getNewToken(oAuthClient);
    oAuthClient.setCredentials(JSON.parse(token));
    return oAuthClient;
  });
}

function getNewToken(oAuthClient) {
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
      return oAuthClient;
    });
  });
}

module.exports = getToken();
