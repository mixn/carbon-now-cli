import chalk from 'chalk';
import jsonFile from 'jsonfile';
import fileExists from 'file-exists';
import lodash from 'lodash';
import {
	CONFIG_PATH,
	CONFIG_LATEST_PRESET,
} from '../helpers/cli/constants.helper.js';
import presetMissingView from '../views/preset-missing.view.js';

class PresetHandler {
	constructor(private configPath: string = CONFIG_PATH) {}

	private async writeConfig(
		configSettings = {},
		jsonFileOptions = {}
	): Promise<void> {
		await jsonFile.writeFileSync(
			this.configPath,
			configSettings,
			jsonFileOptions
		);
	}

	private async readConfig(): Promise<CarbonCLIConfigInterface> {
		const configPath = this.configPath;
		if (await fileExists(configPath)) {
			return await jsonFile.readFileSync(configPath);
		}
		// Only create a global config, hence don’t overwrite custom --config
		if (configPath === CONFIG_PATH) {
			await this.writeConfig();
			return await this.readConfig();
		}
		return {};
	}

	private warn(preset: string): void {
		console.warn(presetMissingView(preset));
	}

	public async getPreset(preset: string): Promise<CarbonCLIPresetType> {
		const currentConfig: CarbonCLIConfigInterface = await this.readConfig();
		if (preset in currentConfig) {
			return currentConfig[preset];
		}
		this.warn(preset);
		return {};
	}

	public async savePreset(
		preset = CONFIG_LATEST_PRESET,
		presetSettings = {}
	): Promise<void> {
		const whiteListedSettings = lodash.omit(presetSettings, [
			'save',
			'preset',
			'l',
		]);
		const currentConfig = await this.readConfig();
		const upcomingConfig = {
			...currentConfig,
			...(preset !== CONFIG_LATEST_PRESET && {
				[preset]: whiteListedSettings,
			}),
			[CONFIG_LATEST_PRESET]: whiteListedSettings,
		};
		await this.writeConfig(upcomingConfig, {
			spaces: 2,
			EOL: '\r\n',
		});
	}
}

export default PresetHandler;
