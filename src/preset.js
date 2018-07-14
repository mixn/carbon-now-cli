// Packages
const fileExists = require('file-exists');
const jsonFile = require('jsonfile');
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
		if (await fileExists(configLocation)) {
			return await jsonFile.readFileSync(configLocation);
		}

		// If it doesn’t, create first, then read
		await writeConfig(configLocation);
		return await readConfig(configLocation);
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

	return {};
};

// Saves a preset to the config file
const savePreset = async (presetName = LATEST_PRESET, settings = {}, configLocation = FULL_CONFIG_PATH) => {
	try {
		const currentConfig = await readConfig(configLocation);
		const whiteListedSettings = omit(settings, ['save', 'preset', 'l']); // Inquirer or Carbon things, no needed

		// If settings in the config exist, merge them with the new preset,
		// remember the current preset as the last used and make it pretty
		await writeConfig(
			configLocation,
			{
				...currentConfig,
				// If preset should be saved, use spread from an object
				// which uses a computed property to set the name.
				// Hard to read: probably, but short + commented :)
				...(presetName !== LATEST_PRESET && {[presetName]: whiteListedSettings}),
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
