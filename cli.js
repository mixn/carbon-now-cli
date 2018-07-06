#!/usr/bin/env node

// Packages
const meow = require('meow');
const chalk = require('chalk');
const opn = require('opn');
const queryString = require('query-string');

// Source
const processContent = require('./src/process-content.js');
const getLanguage = require('./src/get-language.js');
const headlessVisit = require('./src/headless-visit.js');

const cli = meow(`
	${chalk.bold('Usage')}
    $ carbon-now-sh [file]
		
	${chalk.bold('Options')}
    -s, --start       Starting line of [file]
    -e, --end         Ending line of [file]
    -l, --location    Screenshot save location, default: pwd

  ${chalk.bold('Examples')}
    $ carbon-now-sh foo.js
    $ carbon-now-sh foo.js -s 3 -e 10 # Only copies lines 3-10
	`,
{
	flags: {
		start: {
			type: 'string',
			alias: 's',
			default: 1
		},
		end: {
			type: 'string',
			alias: 'e',
			default: 1000
		},
		open: {
			type: 'string',
			alias: 'o',
			default: false
		},
		location: {
			type: 'string',
			alias: 'l',
			default: process.cwd()
		}
	}
});
const [file] = cli.input;
const {start, end, open, location} = cli.flags;
const defaultSettings = {
	l: 'auto'
	// Add all…
};
let url = 'https://carbon.now.sh/';

if (!file) {
	console.error(`
  ${chalk.red('Error: Please provide at least a file.')}
		
  $ carbon-now-sh [file]
	`);
	process.exit(1);
}

(async () => {
	try {
		const processedContent = await processContent(file, start, end);
		const encodedContent = encodeURIComponent(processedContent);
		const settings = {
			...defaultSettings,
			code: encodedContent,
			l: getLanguage(file)
		};

		url = `${url}?${queryString.stringify(settings)}`;

		if (open) {
			opn(url);
		} else {
			await headlessVisit(url, location);
		}

		process.exit();
	} catch (error) {
		console.error(`
  ${chalk.red('Error: Sending code to https://carbon.now.sh went wrong.')}

  This is mostly due to:

  – Insensical input like \`--start 10 --end 2\`
  – Carbon being down or taking too long to respond
  – Your internet connection not working or being too slow
	`);
		process.exit(1);
	}
})();
