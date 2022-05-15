// Packages
const fileExists = require('file-exists');
const jsonFile = require('jsonfile');
const {yellow} = require('chalk');
const {omit} = require('lodash');

// Source
const {FULL_CONFIG_PATH, LATEST_PRESET} = require('./helpers/globals');

// Creates or and/or writes (to) a config file
const writeConfig = async (configLocation = FULL_CONFIG_PATH, settings = {}, options = {}) => {
	try {
		await jsonFile.writeFileSync(
			configLocation,
			settings,
			options
		);
	} catch (error) {
		return Promise.reject(error);
	}
};

// Reads a config file
const readConfig = async function readConfig(configLocation = FULL_CONFIG_PATH) {
	try {
		// Only read from if it exists
		if (await fileExists(configLocation,{root: process.cwd()})) {
			return await jsonFile.readFileSync(configLocation);
		}

		// If it doesn’t exist and is global config, create first, then read
		// Never create local configs passed in via --config
		if (configLocation === FULL_CONFIG_PATH) {
			await writeConfig(configLocation);
			return await readConfig(configLocation);
		}

		return {};
	} catch (error) {
		return Promise.reject(error);
	}
};

// Fetches a preset, if existent
const getPreset = async (presetName, configLocation = FULL_CONFIG_PATH) => {
	const currentConfig = await readConfig(configLocation);

	if (presetName in currentConfig) {
		return currentConfig[presetName];
	}

	// Warn if anything but 'latest-preset' is passed, but non-existent
	if (presetName !== LATEST_PRESET) {
		console.error(`
  ${yellow('Warning: Preset doesn’t exist. Using default settings…\n')}`
		);
	}

	return {};
};

// Saves a preset to the config file
const savePreset = async (presetName = LATEST_PRESET, settings = {}, configLocation = FULL_CONFIG_PATH) => {
	try {
		// Omit not needed Inquirer or Carbon things
		const whiteListedSettings = omit(settings, ['save', 'preset', 'l']);
		const currentConfig = await readConfig(configLocation);

		await writeConfig(
			configLocation,
			{
				// Take and merge existing config to not overwrite
				...currentConfig,
				// Only additionally save this preset if the incoming `presetName` is not 'latest-preset'
				// Reads: “If `presetName` doesn’t equal 'latest-preset', object spread the values of
				// an object that has a computed property based on the name of `presetName` into the new settings”
				// A bit hard to read, but avoids extra work outside this line + commented :)
				...(presetName !== LATEST_PRESET && {[presetName]: whiteListedSettings}),
				// Always save 'latest-preset'
				[LATEST_PRESET]: whiteListedSettings
			},
			{
				spaces: 2,
				EOL: '\r\n'
			}
		);
	} catch (error) {
		Promise.reject(error);
	}
};

// Export API
module.exports = {
	get: getPreset,
	save: savePreset
};
