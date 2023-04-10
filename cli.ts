#!/usr/bin/env node
import task from 'tasuku';
import queryString from 'query-string';
import open from 'open';

import PromptModule from './src/modules/prompt.module.js';
import PresetHandlerModule from './src/modules/preset-handler.module.js';
import FileHandlerModule from './src/modules/file-handler.module.js';
import defaultSettings from './src/config/cli/default-settings.config.js';
import errorView from './src/views/error.view.js';
import { CARBON_URL } from './src/helpers/carbon/constants.helper.js';

const Prompt = await PromptModule.create();
const file = Prompt.getFile;
const flags = Prompt.getFlags;
const answers = Prompt.getAnswers;
const input = Prompt.getInput;
const PresentHandler = new PresetHandlerModule();
const FileHandler = new FileHandlerModule(file);
let presetSettings = {
	...defaultSettings,
	l: FileHandler.getMimeType,
};

// If --preset, get it and merge with defaults
if (flags.preset) {
	presetSettings = {
		...presetSettings,
		...(await PresentHandler.getPreset(flags.preset)),
	};
}

// --interactive has highest priority, even when --preset is set
if (flags.interactive) {
	presetSettings = {
		...presetSettings,
		// TODO: Fix typing
		...(answers as {}),
	};
}

// If not a local --config, always save the latest run
if (!flags.config) {
	await PresentHandler.savePreset(presetSettings.preset, presetSettings);
}

// Task 1: Process and encode file
const { result: encodedContent } = await task(
	`Processing ${
		file || (flags.fromClipboard ? 'input from clipboard' : 'input from stdin')
	}`,
	async () => {
		try {
			return encodeURIComponent(
				await FileHandler.process(input, flags.start, flags.end)
			);
		} catch (e) {
			// TODO: Fix typing
			console.error(errorView(e as string));
			process.exit(1);
		}
	}
);

// Task 2: Prepare URL
const { result: preparedURL } = await task(
	'Preparing connection',
	async () =>
		`${CARBON_URL}?${queryString.stringify({
			...presetSettings,
			code: encodedContent,
		})}`
);

// Task 3: Open image in browser or download image
if (flags.open) {
	task('Opening in browser', () => open(preparedURL));
} else {
	await task('Fetching beautiful image', async () => {});
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
// 	'\n encodedContent: \n',
// 	encodedContent,
// 	'\n preparedURL: \n',
// 	preparedURL
// );
