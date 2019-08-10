const fs = require("fs");

const FILE_TO_WATCH = "../injected-code-dist/index.js";
const OUTPUT_FILE = "../src/injection.ts";

console.log("Started watching: " + FILE_TO_WATCH);
console.log("Will write to: " + OUTPUT_FILE);

function mapInputToOutput(contents) {
  const fileOutput =
    "export const CODE_TO_INJECT = " + JSON.stringify({ code: contents });

  return fileOutput;
}

let prev = null;
function makeOutputFile() {
  fs.readFile(FILE_TO_WATCH, "utf8", function(err, contents) {
    if (err) return console.log(err);
    if (contents === prev) return; // to prevent random unneccesary writes. Not ideal.
    prev = contents;

    const fileOutput = mapInputToOutput(contents);

    fs.writeFile(OUTPUT_FILE, fileOutput, function(err) {
      if (err) return console.log(err);
      console.log("The file was saved!");
    });
  });
}

makeOutputFile();
fs.watch(FILE_TO_WATCH, (curr, prev) => {
  if (curr === prev) return;
  makeOutputFile();
});
