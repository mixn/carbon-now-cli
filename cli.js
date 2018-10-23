#!/usr/bin/env node

// Native
const {promisify} = require('util');
const {basename, extname} = require('path');
const asyncRename = promisify(require('fs').rename);

// Packages
const meow = require('meow');
const {bold, red, green} = require('chalk');
const opn = require('opn');
const queryString = require('query-string');
const terminalImage = require('terminal-image');
const generate = require('nanoid/generate');
const tempy = require('tempy');
const updateNotifier = require('update-notifier');
const Listr = require('listr');

// Source
const pkg = require('./package.json');
const processContent = require('./src/process-content');
const getLanguage = require('./src/get-language');
const headlessVisit = require('./src/headless-visit');
const interactiveMode = require('./src/interactive-mode');
const presetHandler = require('./src/preset');
const imgToClipboard = require('./src/util/img-to-clipboard');

// Helpers
const {CARBON_URL, LATEST_PRESET} = require('./src/helpers/globals');
let settings = require('./src/helpers/default-settings');

const cli = meow(`
 ${bold('Usage')}
   $ carbon-now <file>

 ${bold('Options')}
   -s, --start          Starting line of <file>
   -e, --end            Ending line of <file>
   -i, --interactive    Interactive mode
   -l, --location       Image save location, default: cwd
   -t, --target         Image name, default: original-hash.{png|svg}
   -o, --open           Open in browser instead of saving
   -c, --copy           Copy image to clipboard
   -p, --preset         Use a saved preset
   -h, --headless       Use only non-experimental Puppeteer features
   --config             Use a different, local config (read-only)

 ${bold('Examples')}
   See: https://github.com/mixn/carbon-now-cli#examples
`,
{
	flags: {
		start: {
			type: 'number',
			alias: 's',
			default: 1
		},
		end: {
			type: 'number',
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
		target: {
			type: 'string',
			alias: 't',
			default: null
		},
		interactive: {
			type: 'boolean',
			alias: 'i',
			default: false
		},
		preset: {
			type: 'string',
			alias: 'p',
			default: LATEST_PRESET
		},
		copy: {
			type: 'boolean',
			alias: 'c',
			default: false
		},
		config: {
			type: 'string',
			default: undefined // So that default params trigger
		},
		headless: {
			type: 'boolean',
			alias: 'h',
			default: false
		}
	}
});
const [FILE] = cli.input;
const {
	start: START_LINE,
	end: END_LINE,
	open: OPEN,
	location: LOCATION,
	target: TARGET,
	copy: COPY,
	interactive: INTERACTIVE,
	preset: PRESET,
	config: CONFIG,
	headless: HEADLESS
} = cli.flags;
let url = CARBON_URL;

// Deny everything if not at least one argument (file) specified
if (!FILE) {
	console.error(`
  ${red('Error: Please provide at least a file.')}

  $ carbon-now <file>
	`);

	process.exit(1);
}

// Run main CLI programm
(async () => {
	// If --preset given, take that particular preset
	if (PRESET) {
		settings = {
			...settings,
			...(await presetHandler.get(PRESET, CONFIG))
		};
	}

	// If --interactive, enter interactive mode and adopt settings
	// This unfortunately can’t be inside of Listr since it leads to rendering problems
	if (INTERACTIVE) {
		settings = {
			...settings,
			...(await interactiveMode())
		};
	}

	// Prepare tasks
	const tasks = new Listr([
		// Task 1: Process and encode file
		{
			title: `Processing ${FILE}`,
			task: async ctx => {
				const processedContent = await processContent(FILE, START_LINE, END_LINE);
				ctx.urlEncodedContent = encodeURIComponent(processedContent);
			}
		},
		// Task 2: Merge all given settings (default, preset, interactive), prepare URL
		{
			title: 'Preparing connection',
			task: async ({urlEncodedContent}) => {
				// Save the current settings as 'latest-preset' to global config
				// Don’t do so for local configs passed via --config
				// The `save` method takes care of whether something should
				// also be saved as a preset, or just as 'latest-preset'
				if (!CONFIG) {
					await presetHandler.save(settings.preset, settings);
				}

				// Add code and language, irrelevant for storage and always different
				settings = {
					...settings,
					code: urlEncodedContent,
					l: getLanguage(FILE)
				};

				// Prepare the querystring that we’ll send to Carbon
				url = `${url}?${queryString.stringify(settings)}`;
			}
		},
		// Task 3: Only open the browser if --open
		{
			title: 'Opening in browser',
			skip: () => !OPEN,
			task: () => {
				opn(url);
			}
		},
		// Task 4: Download image to --location if not --open
		{
			title: 'Fetching beautiful image',
			skip: () => OPEN,
			task: async ctx => {
				const {type: IMG_TYPE} = settings;
				const SAVE_DIRECTORY = COPY ? tempy.directory() : LOCATION;
				const FULL_DOWNLOADED_PATH = `${SAVE_DIRECTORY}/carbon.${IMG_TYPE}`;
				const ORIGINAL_FILE_NAME = basename(FILE, extname(FILE));
				const NEW_FILE_NAME = TARGET || `${ORIGINAL_FILE_NAME}-${generate('123456abcdef', 10)}`;
				const FULL_SAVE_PATH = `${SAVE_DIRECTORY}/${NEW_FILE_NAME}.${IMG_TYPE}`;

				// Fetch image
				await headlessVisit(url, SAVE_DIRECTORY, IMG_TYPE, HEADLESS);

				// Don’t rename file if --copy
				if (COPY) {
					ctx.downloadedAs = FULL_DOWNLOADED_PATH;
				} else {
					await asyncRename(FULL_DOWNLOADED_PATH, FULL_SAVE_PATH);
					ctx.downloadedAs = FULL_SAVE_PATH;
				}
			}
		},
		// Task 5: Copy image to clipboard if --copy
		{
			title: 'Copying image to clipboard',
			skip: () => !COPY || OPEN,
			task: async ({downloadedAs}) => {
				await imgToClipboard(downloadedAs);
			}
		}
	]);

	try {
		const {downloadedAs} = await tasks.run();

		console.log(`
  ${green('Done!')}`
		);

		if (OPEN) {
			console.log(`
  Browser opened — finish your image there! 😌`
			);
		} else if (COPY) {
			console.log(`
  Image copied to clipboard! 😌`
			);
		} else {
			console.log(`
  The file can be found here: ${downloadedAs} 😌`
			);

			if (process.env.TERM_PROGRAM && process.env.TERM_PROGRAM.match('iTerm')) {
				console.log(`
  iTerm2 should display the image below. 😊

				${await terminalImage.file(downloadedAs)}`
				);
			}
		}

		updateNotifier({pkg}).notify();

		process.exit();
	} catch (error) {
		console.error(`
  ${red('Error: Sending code to https://carbon.now.sh went wrong.')}

  This is mostly due to:

  – Insensical input like \`--start 10 --end 2\`
  – Carbon being down or taking too long to respond
  – Your internet connection not working or being too slow

  Additional info:

  ${error}`);

		process.exit(1);
	}
})();
