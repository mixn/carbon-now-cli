import chalk from 'chalk';
import jsonFile from 'jsonfile';
import fileExists from 'file-exists';
import { omit } from 'lodash';
import {
	CONFIG_PATH,
	CONFIG_LATEST_PRESET,
} from '../helpers/cli/constants.helper.js';

class PresetHandler {
	private async writeConfig(
		configLocation = CONFIG_PATH,
		settings = {},
		options = {}
	) {
		try {
			await jsonFile.writeFileSync(configLocation, settings, options);
		} catch (error) {
			return Promise.reject(error);
		}
	}
	// TODO: Improve Promise<object>
	private async readConfig(configLocation = CONFIG_PATH): Promise<object> {
		try {
			// Only read from config if it exists
			if (await fileExists(configLocation)) {
				return await jsonFile.readFileSync(configLocation);
			}

			// Only if CONFIG_PATH is the default, global path, create config first, then read
			// This (rightly) won’t create a config if a custom one is passed in via --config
			if (configLocation === CONFIG_PATH) {
				await this.writeConfig(configLocation);
				return await this.readConfig(configLocation);
			}

			// Empty config by default
			return {};
		} catch (error) {
			return Promise.reject(error);
		}
	}
	async getPreset(presetName: string, configLocation = CONFIG_PATH) {
		const currentConfig: any = await this.readConfig(configLocation);

		if (presetName in currentConfig) {
			return currentConfig[presetName];
		}

		// Warn if anything but 'latest-preset' is passed, but non-existent
		if (presetName !== CONFIG_LATEST_PRESET) {
			console.warn(`
		${chalk.yellow(
			`Warning: Preset '${presetName}' doesn’t exist. Using default settings…\n`
		)}`);
		}

		return {};
	}
	async savePreset(
		presetName = CONFIG_LATEST_PRESET,
		settings = {},
		configLocation = CONFIG_PATH
	) {
		try {
			// Omit not needed Inquirer or Carbon things
			const whiteListedSettings = omit(settings, ['save', 'preset', 'l']);
			const currentConfig = await this.readConfig(configLocation);

			await this.writeConfig(
				configLocation,
				{
					// Take and merge existing config to not overwrite
					...currentConfig,
					// Only additionally save this preset if the incoming `presetName` is not 'latest-preset'
					// Reads: “If `presetName` doesn’t equal 'latest-preset', object spread the values of
					// an object that has a computed property based on the name of `presetName` into the new settings”
					// A bit hard to read, but avoids extra work outside this line + commented :)
					...(presetName !== CONFIG_LATEST_PRESET && {
						[presetName]: whiteListedSettings,
					}),
					// Always save 'latest-preset'
					[CONFIG_LATEST_PRESET]: whiteListedSettings,
				},
				{
					spaces: 2,
					EOL: '\r\n',
				}
			);
		} catch (error) {
			Promise.reject(error);
		}
	}
}

export default PresetHandler;
