// Packages
const fileExists = require('file-exists');
const jsonFile = require('jsonfile');
const {omit} = require('lodash');

// Source
const {FULL_CONFIG_PATH} = require('./helpers/globals');

module.exports = {
	async save(presetName, settings, config = FULL_CONFIG_PATH) {
		let currentConfig = {};

		try {
			if (await fileExists(config)) {
				// We want to remember the current config if one exsists
				currentConfig = await jsonFile.readFileSync(config);
			}

			// This will create the file if it doesn’t exist
			// or append to it an existing config, if it does
			await jsonFile.writeFileSync(
				config,
				{
					...currentConfig,
					[presetName]: {
						...omit(settings, ['save', 'preset', 'l'])
					},
					'last-used-preset': presetName
				},
				{
					spaces: 2,
					EOL: '\r\n'
				}
			);
		} catch (error) {
			Promise.reject(error);
		}
	}
};
