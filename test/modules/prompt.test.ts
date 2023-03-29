import { expect, jest, test } from '@jest/globals';
import inquirer from 'inquirer';
import promptConfig from '../../src/config/cli/prompt.config.js';
import Prompt from '../../src/modules/prompt.module.js';

jest.mock('inquirer');

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
	expect((await Prompt.create()).getAnswers).toEqual(mappedAnswers);
});
