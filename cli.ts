#!/usr/bin/env node
import open from 'open';
import updateNotifier from 'update-notifier';
import { Listr } from 'listr2';
import { stringify } from 'query-string';
import { clipboard } from 'clipboard-sys';

import PromptModule from './src/modules/prompt.module.js';
import PresetHandlerModule from './src/modules/preset-handler.module.js';
import FileHandlerModule from './src/modules/file-handler.module.js';
import DownloadModule from './src/modules/download.module.js';
import RenderModule from './src/headless-visit.js';
import readFileAsync from './src/utils/read-file-async.util.js';
import defaultErrorView from './src/views/default-error.view.js';
import defaultSuccessView from './src/views/default-success.view.js';
import defaultSettings from './src/config/cli/default-settings.config.js';
import packageJson from './package.json' assert { type: 'json' };
import { CARBON_URL } from './src/helpers/carbon/constants.helper.js';

const Prompt = await PromptModule.create();
const file = Prompt.getFile;
const flags = Prompt.getFlags;
const answers = Prompt.getAnswers;
const input = Prompt.getInput;
const PresentHandler = new PresetHandlerModule(flags.config);
const FileHandler = new FileHandlerModule(file);
const Download = new DownloadModule(file);
const TaskList = new Listr([]);
let presetSettings = {
	...defaultSettings,
	l: FileHandler.getMimeType,
};

// If --preset set, merge the preset into defaults
if (flags.preset) {
	presetSettings = {
		...presetSettings,
		...(await PresentHandler.getPreset(flags.preset)),
	};
}

// --interactive has highest priority, even with --preset
if (flags.interactive) {
	presetSettings = {
		...presetSettings,
		// TODO: Fix typing
		...(answers as {}),
	};
}

// As long as it’s not a local --config, always save the latest run
if (!flags.config) {
	await PresentHandler.savePreset(presetSettings.preset, presetSettings);
}

// Task 1: Process and encode input
TaskList.add([
	{
		title: `Processing ${
			file ||
			(flags.fromClipboard ? 'input from clipboard' : 'input from stdin')
		}`,
		task: async (ctx) => {
			ctx.encodedContent = encodeURIComponent(
				await FileHandler.process(input, flags.start, flags.end)
			);
		},
	},
]);

// Task 2: Prepare things
TaskList.add([
	{
		title: 'Preparing connection',
		task: (ctx) => {
			ctx.preparedURL = `${CARBON_URL}?${stringify({
				...presetSettings,
				code: ctx.encodedContent,
			})}`;
			Download.setFlags = flags;
			Download.setImgType = presetSettings.type;
		},
	},
]);

// Task 3: Open image in browser [skippable]
TaskList.add([
	{
		title: 'Opening in browser',
		skip: !flags.open,
		task: ({ preparedURL }) => {
			open(preparedURL);
		},
	},
]);

// Task 4: Fetch image and rename it, if necessary [skippable]
TaskList.add([
	{
		title: 'Fetching beautiful image',
		skip: flags.open,
		task: async ({ preparedURL }) => {
			await RenderModule({
				url: preparedURL,
				location: Download.getSaveDirectory,
				type: 'png',
				headless: false,
			});
			if (!flags.copy) {
				await FileHandler.rename(
					Download.getDownloadedAsPath,
					Download.getSavedAsPath
				);
			}
		},
	},
]);

// Task 5: Copy image to clipboard [skippable]
TaskList.add([
	{
		title: 'Copying image to clipboard',
		skip: !flags.copy || flags.open,
		task: async ({ preparedURL }) => {
			await clipboard.writeImage(
				await readFileAsync(Download.getDownloadedAsPath, false)
			);
		},
	},
]);

try {
	await TaskList.run();
	console.log(await defaultSuccessView(flags, Download.getPath));
	updateNotifier({ pkg: packageJson }).notify();
	process.exit();
} catch (e) {
	console.error(defaultErrorView((e as Error).message));
	process.exit(1);
}

// console.log(
// 	'\n FILE: \n',
// 	file,
// 	'\n FLAGS: \n',
// 	flags,
// 	'\n ANSWERS: \n',
// 	answers,
// 	'\n INPUT: \n',
// 	input,
// 	'\n PRESET SETTINGS: \n',
// 	presetSettings,
// );
