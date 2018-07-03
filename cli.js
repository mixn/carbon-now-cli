#!/usr/bin/env node

// Native
const {URL} = require('url');

// Packages
const meow = require('meow');
const chalk = require('chalk');
const opn = require('opn');

// Source
const processContent = require('./src/process-content.js');

const cli = meow(`
	Usage
	  $ carbon-now-sh <file>

	Examples
	  $ carbon-now-sh unfold.js
`);
const [file] = cli.input;

if (!file) {
	console.error(`
  ${chalk.red('Error: Please provide at least a file.')}
		
  $ carbon-now-sh <file>
	`);
	process.exit(1);
}

const sendSourceCode = async () => {
	try {
		const url = new URL('https://carbon.now.sh');
		const encodedContent = encodeURIComponent(await processContent(file));

		url.searchParams.set('code', encodedContent);

		opn(url.toString());
		process.exit();
	} catch (error) {
		console.error(`
  ${chalk.red('Error: Sending code to https://carbon.now.sh went wrong — please try again.')}
	`);
		process.exit(1);
	}
};

sendSourceCode();
