import inquirer from 'inquirer';
import lodash from 'lodash';
import meow from 'meow';
import {
	mappingsConfig,
	MappingsConfigInterface,
	MappingsConfigPropertiesType,
} from '../config/carbon/mappings.config.js';
import flags from '../config/cli/flags.config.js';
import promptConfig from '../config/cli/prompt.config.js';
import defaultView from '../views/default.view.js';

class Prompt {
	private file!: string;
	private flags!: CarbonCLIFlagsInterface;
	private answers!: CarbonCLIPromptAnswersInterface;

	static async create(): Promise<Prompt> {
		const PromptInstance = new this();
		await PromptInstance.init();
		return PromptInstance;
	}

	private async init() {
		await this.bootstrapMeow();
		await this.bootstrapInquirer();
		this.mapAnswersToCarbonValues();
	}

	private async bootstrapMeow() {
		const cli = meow(defaultView, {
			// TODO: Include this once Jest+ESM problem is fixed
			// importMeta: import.meta,
			flags,
		});
		this.file = cli.input[0];
		this.flags = cli.flags as CarbonCLIFlagsInterface;
	}

	private async bootstrapInquirer() {
		this.answers = await inquirer.prompt(promptConfig);
	}

	private mapAnswersToCarbonValues() {
		this.answers = lodash.mapValues(
			this.answers,
			(value, key) =>
				mappingsConfig[key as keyof MappingsConfigInterface]?.[
					value as MappingsConfigPropertiesType
				] ?? value
		);
	}

	public get getFlags() {
		return this.flags;
	}

	public get getAnswers() {
		return this.answers;
	}

	public get getFile() {
		return this.file;
	}
}

export default Prompt;
