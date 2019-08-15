const { google } = require("googleapis");

class Sheet {
  constructor(auth, id) {
    this.sheets = google.sheets({ version: "v4", auth });
    this.spreadsheetId = id;
  }

  async read(range) {
    return new Promise((resolve, reject) => {
      let { spreadsheetId } = this;
      this.sheets.spreadsheets.values.get(
        { spreadsheetId, range },
        (err, data) => {
          if (err) {
            //console.error(err);
            return reject(err);
          }
          //console.log(`${data.values ? data.values.length : 0} rows retrieved`);

          resolve(data);
        }
      );
    });
  }
}

module.exports = Sheet;
