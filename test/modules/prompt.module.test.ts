import { expect, jest, test } from '@jest/globals';
import inquirer from 'inquirer';
import meow from 'meow';
import flagsConfig from '../../src/config/cli/flags.config.js';
import promptConfig from '../../src/config/cli/prompt.config.js';
import Prompt from '../../src/modules/prompt.module.js';
import defaultView from '../../src/views/default.view.js';

jest.mock('inquirer');

// https://github.com/facebook/jest/issues/5089#issuecomment-392827082
process.argv.push('some-file');
process.argv.push('-s', '3');
process.argv.push('-e', '100');
process.argv.push('-o');
process.argv.push('-l', '~/Desktop');
process.argv.push('-t', 'foo.jpg');
process.argv.push('-i');
process.argv.push('-c');
process.argv.push('-p', 'twitter');
process.argv.push('-h');
process.argv.push('--from-clipboard');

let inquirerOutput: CarbonCLIPromptAnswersInterface;
let mappedAnswers: CarbonCLIPromptAnswersMappedInterface;

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
	expect((await Prompt.create()).getFile).toBe('some-file');
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
