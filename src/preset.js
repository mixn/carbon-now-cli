// Native
const {homedir} = require('os');

// Packages
const fileExists = require('file-exists');
const jsonFile = require('jsonfile');
const {omit} = require('lodash');

const CONFIG_FILE = `${homedir()}/.carbon-now.json`;

module.exports = {
	async save(presetName, settings) {
		let currentConfig = {};

		try {
			if (await fileExists(CONFIG_FILE)) {
				// We want to remember the current config if one exsists
				currentConfig = await jsonFile.readFileSync(CONFIG_FILE);
			}

			// This will create the file if it doesn’t exist
			// and append to it an existing config, if it does
			await jsonFile.writeFileSync(
				CONFIG_FILE,
				{
					...currentConfig,
					[presetName]: {
						...omit(settings, ['save', 'preset'])
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
