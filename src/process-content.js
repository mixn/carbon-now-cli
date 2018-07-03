// Native
const fs = require("fs");
const readline = require("readline");

module.exports = file => {
  return new Promise(resolve => {
    const lines = [];
    const rlStream = readline.createInterface({
      input: fs.createReadStream(file)
    });

    rlStream.on("line", line => lines.push(line));

    rlStream.on("close", () => {
      resolve(lines.join("\n"));
    });
  });
};
