import inquirer from 'inquirer';
import PromptModule from '../../../src/modules/prompt.module.js';
import promptConfig from '../../../src/config/cli/prompt.config.js';
import { DUMMY_FILE } from '../../helpers/constants.helper.js';

jest.mock('inquirer');
jest.mock('get-stdin');

process.argv.push(DUMMY_FILE);
process.argv.push('-i');
process.argv.push('-s', '3');
process.argv.push('-e', '100');
process.argv.push('-o');
process.argv.push('-l', '~/Desktop');
process.argv.push('-t', 'foo.jpg');
process.argv.push('-c');
process.argv.push('-p', 'twitter');
process.argv.push('-h');
process.argv.push('--from-clipboard');

describe('PromptModule', () => {
  let inquirerOutput: CarbonCLIPromptAnswersType;
  let mappedAnswers: CarbonCLIPromptAnswersMappedType;

  beforeEach(() => {
    inquirerOutput = {
      t: '3024 Night',
      wt: 'None',
      fm: 'Hack',
      fs: '18px',
      bg: '#ADB7C1',
      wc: true,
      ln: false,
      wa: true,
      lh: '133%',
      pv: '0px',
      ph: '0px',
      ds: false,
      si: false,
      wm: false,
      es: '2x',
      type: 'png',
      save: false,
      l: 'auto',
      preset: 'latest-preset',
    };
    mappedAnswers = {
      t: '3024-night',
      wt: 'none',
      fm: 'Hack',
      fs: '18px',
      bg: '#ADB7C1',
      wc: true,
      ln: false,
      wa: true,
      lh: '133%',
      pv: '0px',
      ph: '0px',
      ds: false,
      si: false,
      wm: false,
      es: '2x',
      type: 'png',
      save: false,
      l: 'auto',
      preset: 'latest-preset',
    };
  });

  it('should work as an async factory', async () => {
    const Prompt = await PromptModule.create();
    expect(Prompt).toBeInstanceOf(PromptModule);
  });

  it('should return mapped answers correctly', async () => {
    (inquirer as jest.Mocked<typeof inquirer>).prompt.mockResolvedValue(
      inquirerOutput
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
      open: true,
      copy: true,
      location: '~/Desktop',
      target: 'foo.jpg',
      interactive: true,
      preset: 'twitter',
      fromClipboard: true,
      headless: true,
    });
  });

  it('should rename certain flags (based on flags.config) correctly', async () => {
    expect(process.argv).toEqual(
      expect.arrayContaining([
        '-s',
        '-e',
        '-o',
        '-l',
        '-t',
        '-i',
        '-p',
        '-c',
        '-h',
      ])
    );
    expect(process.argv).not.toEqual(
      expect.arrayContaining([
        '--start',
        '--end',
        '--open',
        '--location',
        '--target',
        '--interactive',
        '--preset',
        '--copy',
        '--headless',
      ])
    );
    expect(Object.keys((await PromptModule.create()).getFlags)).toEqual(
      expect.arrayContaining([
        'start',
        'end',
        'open',
        'location',
        'target',
        'interactive',
        'preset',
        'copy',
        'headless',
      ])
    );
  });
});
