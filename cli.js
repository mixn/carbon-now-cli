#!/usr/bin/env node

// Native
const {URL} = require('url');

// Packages
const meow = require('meow');
const chalk = require('chalk');
const opn = require('opn');

// Source
const processContent = require('./src/process-content.js');
const getLanguage = require('./src/get-language.js');
const headlessVisit = require('./src/headless-visit.js');

const cli = meow(`
	${chalk.bold('Usage')}
    $ carbon-now-sh [file]
		
	${chalk.bold('Options')}
    -s, --start    Starting line of [file]
    -e, --end      Ending line of [file]

  ${chalk.bold('Examples')}
    $ carbon-now-sh unfold.js
    $ carbon-now-sh unfold.js
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
		}
	}
});
const [file] = cli.input;
const {start, end, open} = cli.flags;
let url = new URL('https://carbon.now.sh');

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

		url.searchParams.set('code', encodedContent);
		url.searchParams.set('l', getLanguage(file));
		url = url.toString();

		if (open) {
			opn(url);
		} else {
			await headlessVisit(url);
		}

		process.exit();
	} catch (error) {
		console.error(`
  ${chalk.red('Error: Sending code to https://carbon.now.sh went wrong.')}

  This is mostly due to:

  – Carbon being down or taking too long to respond
  – Your internet connection not working or being too slow
	`);
		process.exit(1);
	}
})();
