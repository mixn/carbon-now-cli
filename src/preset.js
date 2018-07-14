// Packages
const fileExists = require('file-exists');
const jsonFile = require('jsonfile');
const {omit} = require('lodash');

// Source
const {FULL_CONFIG_PATH} = require('./helpers/globals');

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
		// Only read from if it exsists
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
const savePreset = async (presetName, settings = {}, configLocation = FULL_CONFIG_PATH) => {
	try {
		const currentConfig = await readConfig(configLocation);
		// Inquirer or Carbon specific things that can be left out the config
		const whiteListedSettings = omit(settings, ['save', 'preset', 'l']);

		// If settings in the config exist, merge them with the new preset,
		// remember the current preset as the last used and make it pretty
		await writeConfig(
			configLocation,
			{
				...currentConfig,
				[presetName]: whiteListedSettings,
				'last-used-preset': whiteListedSettings
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

module.exports = {
	get: getPreset,
	save: savePreset
};
