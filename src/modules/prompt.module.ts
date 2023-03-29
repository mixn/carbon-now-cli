import inquirer from 'inquirer';
import lodash from 'lodash';
import {
	mappingsConfig,
	MappingsConfigInterface,
	MappingsConfigProperties,
} from '../config/carbon/mappings.config.js';
import promptConfig from '../config/cli/prompt.config.js';
import { CarbonCLIPromptAnswersInterface } from '../types/cli/types.js';

class Prompt {
	private answers!: CarbonCLIPromptAnswersInterface;

	static async create(): Promise<Prompt> {
		const PromptInstance = new this();
		await PromptInstance.init();
		return PromptInstance;
	}

	private async init() {
		this.answers = await inquirer.prompt(promptConfig);
		this.mapAnswersToCarbonValues();
	}

	private mapAnswersToCarbonValues() {
		this.answers = lodash.mapValues(
			this.answers,
			(value, key) =>
				mappingsConfig[key as keyof MappingsConfigInterface]?.[
					value as MappingsConfigProperties
				] ?? value
		);
	}
}

export default Prompt;
