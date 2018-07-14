#!/usr/bin/env node

// Packages
const meow = require('meow');
const chalk = require('chalk');
const opn = require('opn');
const queryString = require('query-string');
const terminalImage = require('terminal-image');
const Listr = require('listr');

// Source
const processContent = require('./src/process-content.js');
const getLanguage = require('./src/get-language.js');
const headlessVisit = require('./src/headless-visit.js');
const interactiveMode = require('./src/interactive-mode.js');
const generateRandomSettings = require('./src/generate-random-settings.js');

// Helpers
let settings = require('./src/helpers/default-settings');

const cli = meow(`
 ${chalk.bold('Usage')}
   $ carbon-now <file>
		
 ${chalk.bold('Options')}
   -s, --start          Starting line of <file>
   -e, --end            Ending line of <file>
   -i, --interactive    Interactive mode
   -l, --location       Screenshot save location, default: cwd
   -o, --open           Open in browser instead of saving
   -r, --random         Use random settings

 ${chalk.bold('Examples')}
   See: https://github.com/mixn/carbon-now-cli#examples
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
			type: 'boolean',
			alias: 'o',
			default: false
		},
		location: {
			type: 'string',
			alias: 'l',
			default: process.cwd()
		},
		interactive: {
			type: 'boolean',
			alias: 'i',
			default: false
		},
		random: {
			type: 'boolean',
			alias: 'r',
			default: false
		}
	}
});
const [file] = cli.input;
const {start, end, open, location, interactive, random} = cli.flags;
let url = 'https://carbon.now.sh/';

// Deny everything if not at least one argument (file) specified
if (!file) {
	console.error(`
  ${chalk.red('Error: Please provide at least a file.')}
		
  $ carbon-now <file>
	`);
	process.exit(1);
}

// Run main CLI programm
(async () => {
	// If --interactive, enter interactive mode and adopt settings
	if (interactive) {
		settings = {
			...settings,
			...(await interactiveMode())
		};
	}

	// If --random, use generate random settings
	if (random) {
		settings = {
			...settings,
			...generateRandomSettings()
		};
	}

	// Prepare tasks
	const tasks = new Listr([
		// Task 1: Process and encode file
		{
			title: `Processing ${file}`,
			task: async ctx => {
				try {
					const processedContent = await processContent(file, start, end);
					ctx.encodedContent = encodeURIComponent(processedContent);
				} catch (error) {
					return Promise.reject(error);
				}
			}
		},
		// Task 2: Merge all settings (interactive, given, default, detected)
		{
			title: 'Preparing connection',
			task: ({encodedContent}) => {
				settings = {
					...settings,
					code: encodedContent,
					l: getLanguage(file)
				};

				url = `${url}?${queryString.stringify(settings)}`;
			}
		},
		// Task 3: Open only browser if --open
		{
			title: 'Opening in browser',
			skip: () => !open,
			task: () => {
				opn(url);
			}
		},
		// Task 4: Download image to --location if not --open
		{
			title: 'Fetching beautiful image',
			skip: () => open,
			task: () => headlessVisit(url, location, settings.type)
		}
	]);

	// Run tasks
	// I like the control-flow-iness of .then() and .catch() here
	// and prefer it to async/await in this case… go ahead, JUDGE ME
	tasks
		.run()
		.then(async () => {
			const downloadedFile = `${location}/carbon.${settings.type}`;

			console.log(`
  ${chalk.green('Done!')}`
			);

			if (open) {
				console.log(`
  Browser opened — finish your image there! 😌`
				);
			} else {
				console.log(`
  The file can be found here: ${downloadedFile} 😌`
				);

				if (process.env.TERM_PROGRAM.match('iTerm')) {
					console.log(`
  iTerm2 should display the image below. 😊

		${await terminalImage.file(downloadedFile)}`
					);
				}
			}

			process.exit();
		})
		.catch(() => {
			console.error(`
  ${chalk.red('Error: Sending code to https://carbon.now.sh went wrong.')}

  This is mostly due to:

  – Insensical input like \`--start 10 --end 2\`
  – Carbon being down or taking too long to respond
  – Your internet connection not working or being too slow`);

			process.exit(1);
		});
})();
