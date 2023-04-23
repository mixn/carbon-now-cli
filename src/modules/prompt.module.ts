import meow from 'meow';
import inquirer from 'inquirer';
import clipboard from 'clipboardy';
import lodash from 'lodash';
import getStdin from 'get-stdin';
import {
	mappingsConfig,
	MappingsConfigInterface,
	MappingsConfigPropertyType,
} from '../config/carbon/mappings.config.js';
import readFileAsync from '../utils/read-file-async.util.js';
import flags from '../config/cli/flags.config.js';
import promptConfig from '../config/cli/prompt.config.js';
import defaultView from '../views/default.view.js';
import usageErrorView from '../views/usage-error.view.js';

export default class Prompt {
	private file!: string;
	private flags!: CarbonCLIFlagsInterface;
	private input!: string;
	private answers!: CarbonCLIPromptAnswersInterface;

	static async create(): Promise<Prompt> {
		const PromptInstance = new this();
		await PromptInstance.init();
		return PromptInstance;
	}

	private async init(): Promise<void> {
		await this.initCLIHelper();
		await this.readInput();
		await this.initInquirer();
	}

	private async initCLIHelper(): Promise<void> {
		const cliHelper = meow(defaultView, {
			// TODO: Include this once Jest+ESM problem is fixed
			// importMeta: import.meta,
			flags,
		});
		this.file = cliHelper.input[0];
		this.flags = cliHelper.flags as CarbonCLIFlagsInterface;
	}

	private async readInput(): Promise<void> {
		const stdin = await getStdin();

		if (this.file) {
			this.input = (await readFileAsync(this.file)) as string;
		} else if (this.flags.fromClipboard) {
			this.input = clipboard.readSync();
		} else if (stdin) {
			this.input = stdin;
		} else {
			console.error(usageErrorView);
			process.exit(1);
		}
	}

	private async initInquirer(): Promise<void> {
		if (this.flags.interactive) {
			this.answers = await inquirer.prompt(promptConfig);
			this.mapAnswersToCarbonValues();
		}
	}

	private mapAnswersToCarbonValues(): void {
		this.answers = lodash.mapValues(
			this.answers,
			(value, key) =>
				mappingsConfig[key as keyof MappingsConfigInterface]?.[
					value as MappingsConfigPropertyType
				] ?? value
		);
	}

	public get getFlags(): CarbonCLIFlagsInterface {
		return this.flags;
	}

	public get getAnswers(): CarbonCLIPromptAnswersInterface {
		return this.answers;
	}

	public get getFile(): string {
		return this.file;
	}

	public get getInput(): string {
		return this.input;
	}
}
