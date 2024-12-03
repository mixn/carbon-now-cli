import inquirer from 'inquirer';
import PromptModule from '../../../src/modules/prompt.module.js';
import promptConfig from '../../../src/config/cli/prompt.config.js';
import { DUMMY_FILE } from '../../helpers/constants.helper.js';
import { vi, describe, beforeEach, it, expect } from 'vitest';

vi.mock('inquirer');
vi.mock('get-stdin');

process.argv.push(DUMMY_FILE);
process.argv.push('-i');
process.argv.push('-s', '3');
process.argv.push('-e', '100');
process.argv.push('--open-in-browser');
process.argv.push('--save-to', '~/Desktop');
process.argv.push('--save-as', 'foo.jpg');
process.argv.push('--to-clipboard');
process.argv.push('-p', 'twitter');
process.argv.push('--disable-headless', 'false');
process.argv.push('--from-clipboard');
process.argv.push('--skip-display');

describe('PromptModule', () => {
  let inquirerOutput: CarbonCLIPromptAnswersType;
  let mappedAnswers: CarbonCLIPromptAnswersMappedType;

  beforeEach(() => {
    inquirerOutput = {
      theme: '3024 Night',
      windowTheme: 'None',
      fontFamily: 'Hack',
      fontSize: '18px',
      backgroundColor: '#ADB7C1',
      windowControls: true,
      lineNumbers: false,
      widthAdjustment: true,
      lineHeight: '133%',
      paddingVertical: '0px',
      paddingHorizontal: '0px',
      dropShadow: false,
      squaredImage: false,
      watermark: false,
      exportSize: '2x',
      type: 'png',
      save: false,
      language: 'auto',
      preset: 'latest-preset',
    };
    mappedAnswers = {
      theme: '3024-night',
      windowTheme: 'none',
      fontFamily: 'Hack',
      fontSize: '18px',
      backgroundColor: '#ADB7C1',
      windowControls: true,
      lineNumbers: false,
      widthAdjustment: true,
      lineHeight: '133%',
      paddingVertical: '0px',
      paddingHorizontal: '0px',
      dropShadow: false,
      squaredImage: false,
      watermark: false,
      exportSize: '2x',
      type: 'png',
      save: false,
      language: 'auto',
      preset: 'latest-preset',
    };
  });

  it('should work as an async factory', async () => {
    const Prompt = await PromptModule.create();
    expect(Prompt).toBeInstanceOf(PromptModule);
  });

  it('should return mapped answers correctly', async () => {
    (inquirer as jest.Mocked<typeof inquirer>).prompt.mockResolvedValue(
      inquirerOutput,
    );
    expect(inquirer.prompt).toHaveBeenCalledWith(promptConfig);
    expect((await PromptModule.create()).getAnswers).toEqual(mappedAnswers);
  });

  it('should return <file> name correctly', async () => {
    expect((await PromptModule.create()).getFile).toBe(DUMMY_FILE);
  });

  it('should return given flags correctly', async () => {
    expect((await PromptModule.create()).getFlags).toEqual({
      start: 3,
      end: 100,
      openInBrowser: true,
      toClipboard: true,
      saveTo: '~/Desktop',
      saveAs: 'foo.jpg',
      interactive: true,
      preset: 'twitter',
      fromClipboard: true,
      disableHeadless: false,
      engine: 'chromium',
      skipDisplay: true,
    });
  });

  it('should rename certain flags (based on flags.config) correctly', async () => {
    expect(process.argv).toEqual(
      expect.arrayContaining([
        '-s',
        '-e',
        '--open-in-browser',
        '--save-to',
        '--save-as',
        '-i',
        '-p',
        '--to-clipboard',
        '--disable-headless',
        '--skip-display',
      ]),
    );
    expect(process.argv).not.toEqual(
      expect.arrayContaining([
        '--start',
        '--end',
        '--open-in-browser',
        '--save-to',
        '--save-as',
        '--interactive',
        '--preset',
        '--to-clipboard',
        '--disable-headless',
        '--skip-display',
      ]),
    );
    expect(Object.keys((await PromptModule.create()).getFlags)).toEqual(
      expect.arrayContaining([
        'start',
        'end',
        'openInBrowser',
        'saveTo',
        'saveAs',
        'interactive',
        'preset',
        'toClipboard',
        'disableHeadless',
        'skipDisplay',
      ]),
    );
  });
});
