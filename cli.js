#!/usr/bin/env node

// Packages
const meow = require("meow");
const chalk = require("chalk");

// Utils
const processContent = require("./src/process-content.js");

const cli = meow(`
	Usage
	  $ carbon-now-sh <file>

	Examples
	  $ carbon-now-sh unfold.js
`);
const [file] = cli.input;

if (!file) {
  console.error(`
  ${chalk.red("Error: Please provide at least a file.")}
		
  $ carbon-now-sh <file>
	`);
  process.exit(1);
}

(async () => {
  console.log(await processContent(file));
})();
