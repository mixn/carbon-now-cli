import meow from 'meow';
import inquirer from 'inquirer';
import clipboard from 'clipboardy';
import _ from 'lodash';
import getStdin from 'get-stdin';
import {
  mappingsConfig,
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
  private answers!: CarbonCLIPromptAnswersType;

  static async create(): Promise<Prompt> {
    const PromptInstance = new this();
    await PromptInstance.init();
    return PromptInstance;
  }

  private async init(): Promise<void> {
    [this.file, this.flags] = await this.initCLI();
    this.input = await this.readInput();
    this.answers = await this.initInteractiveMode();
  }

  private async initCLI(): Promise<[string, CarbonCLIFlagsInterface]> {
    const cliHelper = meow(defaultView, {
      importMeta: import.meta,
      flags,
    });
    return [cliHelper.input[0], cliHelper.flags as CarbonCLIFlagsInterface];
  }

  private async readInput(): Promise<string> {
    let stdin;
    if (this.file) {
      return (await readFileAsync(this.file)) as string;
    }
    if (this.flags.fromClipboard) {
      return clipboard.readSync();
    }
    if ((stdin = await getStdin())) {
      return stdin;
    }
    console.error(usageErrorView);
    process.exit(1);
  }

  private async initInteractiveMode(): Promise<CarbonCLIPromptAnswersMappedType> {
    if (this.flags.interactive) {
      // TODO: Fix typing
      return this.mapAnswersToCarbonValues(await inquirer.prompt(promptConfig));
    }
    return {};
  }

  private mapAnswersToCarbonValues(
    unmappedAnswers: CarbonCLIPromptAnswersInterface
  ): CarbonCLIPromptAnswersMappedInterface {
    return _.mapValues(
      unmappedAnswers,
      (value, key) =>
        mappingsConfig[key]?.[value as MappingsConfigPropertyType] ?? value
    );
  }

  public get getFlags(): CarbonCLIFlagsInterface {
    return this.flags;
  }

  public get getAnswers(): CarbonCLIPromptAnswersType {
    return this.answers;
  }

  public get getFile(): string {
    return this.file;
  }

  public get getInput(): string {
    return this.input;
  }
}
