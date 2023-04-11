import getStdin from 'get-stdin';
import Prompt from '../../../src/modules/prompt.module.js';
import { DUMMY_INPUT } from '../../helpers/constants.helper.js';

jest.mock('get-stdin');

describe('PromptModule via stdin', () => {
	it('should handle input from stdin correctly', async () => {
		// TODO: Type this correctly and get rid of @ts-ignore
		// @ts-ignore
		getStdin.mockResolvedValue(DUMMY_INPUT);
		const PromptInstance = await Prompt.create();
		expect(PromptInstance.getFile).toBe(undefined);
		expect(PromptInstance.getFlags.fromClipboard).toBe(false);
		expect(PromptInstance.getInput).toBe(DUMMY_INPUT);
	});
});
