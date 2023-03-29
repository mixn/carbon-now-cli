#!/usr/bin/env node

// // Native
// const { promisify } = require('util');
// const { basename, extname } = require('path');
// const asyncRename = promisify(require('fs').rename);
import chalk from 'chalk';
import PresetHandler from './src/modules/preset-handler.module.js';
import Prompt from './src/modules/prompt.module.js';
import {
	CLI_FILE,
	FLAG_START,
	FLAG_END,
	FLAG_OPEN,
	FLAG_LOCATION,
	FLAG_TARGET,
	FLAG_COPY,
	FLAG_INTERACTIVE,
	FLAG_PRESET,
	FLAG_CONFIG,
	FLAG_FROM_CLIPBOARD,
	FLAG_HEADLESS,
} from './src/modules/meow/index.js';

// const opn = require('opn');
// const queryString = require('query-string');
// const terminalImage = require('terminal-image');
// const generate = require('nanoid/generate');
// const tempy = require('tempy');
// const updateNotifier = require('update-notifier');
// const Listr = require('listr');

// // Source
// const pkg = require('./package.json');
// const getInputFromSource = require('./src/get-input');
// const processContent = require('./src/process-content');
// const getLanguage = require('./src/get-language');
// const headlessVisit = require('./src/headless-visit');
// const interactiveMode = require('./src/interactive-mode');
// const presetHandler = require('./src/preset');
// const imgToClipboard = require('./src/util/img-to-clipboard');

// // Helpers
// let settings = require('./src/helpers/default-settings');

// let url = CARBON_URL;
// let input;

// console.log(await readFileAsync(CLI_FILE));
// console.log(await readInput(CLI_FILE, FLAG_FROM_CLIPBOARD));
// console.log(await readInput(undefined, false));

// // Run main CLI programm
// (async () => {
// 	try {
// 		input = await getInputFromSource(FILE, FROM_CLIPBOARD);
// 	} catch (error) {
// 		console.error(`
//   ${red(error)}

//   ${bold('Usage')}
//     $ carbon-now <file>
//     $ pbpaste | carbon-now
//     $ carbon-now --from-clipboard
// 		`);

// 		process.exit(1);
// 	}

// 	// If --preset given, take that particular preset
// 	if (PRESET) {
// 		settings = {
// 			...settings,
// 			...(await presetHandler.get(PRESET, CONFIG)),
// 		};
// 	}

// 	// If --interactive, enter interactive mode and adopt settings
// 	// This unfortunately can’t be inside of Listr since it leads to rendering problems
// 	if (INTERACTIVE) {
// 		settings = {
// 			...settings,
// 			...(await interactiveMode()),
// 		};
// 	}

// 	// Prepare tasks
// 	const tasks = new Listr([
// 		// Task 1: Process and encode file
// 		{
// 			title: `Processing ${FILE || 'stdin'}`,
// 			task: async (ctx) => {
// 				const processedContent = await processContent(
// 					input,
// 					START_LINE,
// 					END_LINE
// 				);
// 				ctx.urlEncodedContent = encodeURIComponent(processedContent);
// 			},
// 		},
// 		// Task 2: Merge all given settings (default, preset, interactive), prepare URL
// 		{
// 			title: 'Preparing connection',
// 			task: async ({ urlEncodedContent }) => {
// 				// Save the current settings as 'latest-preset' to global config
// 				// Don’t do so for local configs passed via --config
// 				// The `save` method takes care of whether something should
// 				// also be saved as a preset, or just as 'latest-preset'
// 				if (!CONFIG) {
// 					await presetHandler.save(settings.preset, settings);
// 				}

// 				// Add code and language, irrelevant for storage and always different
// 				settings = {
// 					...settings,
// 					code: urlEncodedContent,
// 					l: FILE ? getLanguage(FILE) : 'auto',
// 				};

// 				// Prepare the querystring that we’ll send to Carbon
// 				url = `${url}?${queryString.stringify(settings)}`;
// 			},
// 		},
// 		// Task 3: Only open the browser if --open
// 		{
// 			title: 'Opening in browser',
// 			skip: () => !OPEN,
// 			task: () => {
// 				opn(url);
// 			},
// 		},
// 		// Task 4: Download image to --location if not --open
// 		{
// 			title: 'Fetching beautiful image',
// 			skip: () => OPEN,
// 			task: async (ctx) => {
// 				const { type: IMG_TYPE } = settings;
// 				const SAVE_DIRECTORY = COPY ? tempy.directory() : LOCATION;
// 				const FULL_DOWNLOADED_PATH = `${SAVE_DIRECTORY}/carbon.${IMG_TYPE}`;
// 				const ORIGINAL_FILE_NAME = FILE
// 					? basename(FILE, extname(FILE))
// 					: 'stdin';
// 				const NEW_FILE_NAME =
// 					TARGET || `${ORIGINAL_FILE_NAME}-${generate('123456abcdef', 10)}`;
// 				const FULL_SAVE_PATH = `${SAVE_DIRECTORY}/${NEW_FILE_NAME}.${IMG_TYPE}`;

// 				// Fetch image
// 				await headlessVisit({
// 					url,
// 					location: SAVE_DIRECTORY,
// 					type: IMG_TYPE,
// 					headless: HEADLESS,
// 				});

// 				// Don’t rename file if --copy
// 				if (COPY) {
// 					ctx.downloadedAs = FULL_DOWNLOADED_PATH;
// 				} else {
// 					await asyncRename(FULL_DOWNLOADED_PATH, FULL_SAVE_PATH);
// 					ctx.downloadedAs = FULL_SAVE_PATH;
// 				}
// 			},
// 		},
// 		// Task 5: Copy image to clipboard if --copy
// 		{
// 			title: 'Copying image to clipboard',
// 			skip: () => !COPY || OPEN,
// 			task: async ({ downloadedAs }) => {
// 				await imgToClipboard(downloadedAs);
// 			},
// 		},
// 	]);

// 	try {
// 		const { downloadedAs } = await tasks.run();

// 		console.log(`
//   ${green('Done!')}`);

// 		switch (true) {
// 			case OPEN: {
// 				console.log(`
//   Browser opened — finish your image there! 😌`);
// 				break;
// 			}
// 			case COPY: {
// 				console.log(`
//   Image copied to clipboard! 😌`);
// 				break;
// 			}
// 			default: {
// 				console.log(`
//   The file can be found here: ${downloadedAs} 😌`);

// 				if (
// 					process.env.TERM_PROGRAM &&
// 					process.env.TERM_PROGRAM.match('iTerm')
// 				) {
// 					console.log(`
//   iTerm2 should display the image below. 😊

//   ${await terminalImage.file(downloadedAs)}`);
// 				}
// 			}
// 		}

// 		updateNotifier({ pkg }).notify();

// 		process.exit();
// 	} catch (error) {
// 		console.error(`
//   ${red('Error: Sending code to https://carbon.now.sh went wrong.')}

//   This is mostly due to:

//   – Insensical input like \`--start 10 --end 2\`
//   – Carbon being down or taking too long to respond
//   – Your internet connection not working or being too slow

//   Additional info:

//   ${error}`);

// 		process.exit(1);
// 	}
// })();
