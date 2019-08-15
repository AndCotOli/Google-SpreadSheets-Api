const auth = require("./auth");
const SheetClass = require("./Sheet");
const { sheetID } = require("./config.json");

const Sheet = new SheetClass(auth, sheetID);

async function main() {
  console.log(auth);
  await Sheet.read("Data Class!A2:L");
}

main();
