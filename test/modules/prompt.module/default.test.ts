import inquirer from 'inquirer';
import getStdin from 'get-stdin';
import Prompt from '../../../src/modules/prompt.module.js';
import promptConfig from '../../../src/config/cli/prompt.config.js';
import readFileAsync from '../../../src/utils/read-file-async.util.js';
import { DUMMY_FILE } from '../../helpers/constants.helper.js';

let inquirerOutput: CarbonCLIPromptAnswersInterface;
let mappedAnswers: CarbonCLIPromptAnswersMappedInterface;

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

test('Should work as an async factory', async () => {
	const PromptInstance = await Prompt.create();
	expect(PromptInstance).toBeInstanceOf(Prompt);
});

test('Should correctly return mapped answers', async () => {
	// TODO: Type this correctly and get rid of @ts-ignore
	// @ts-ignore
	inquirer.prompt.mockResolvedValue(inquirerOutput);
	expect(inquirer.prompt).toHaveBeenCalledWith(promptConfig);
	expect((await Prompt.create()).getAnswers).toEqual(mappedAnswers);
});

test('Should correctly return <file> name', async () => {
	expect((await Prompt.create()).getFile).toBe(DUMMY_FILE);
});

test('Should correctly return given flags', async () => {
	expect((await Prompt.create()).getFlags).toEqual({
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

test('Should correctly rename certain flags (based on flags.config)', async () => {
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
	expect(Object.keys((await Prompt.create()).getFlags)).toEqual(
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
