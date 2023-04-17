import getStdin from 'get-stdin';
import PromptModule from '../../../src/modules/prompt.module.js';
import { DUMMY_INPUT } from '../../helpers/constants.helper.js';

jest.mock('get-stdin');

describe('PromptModule via stdin', () => {
	it('should handle input from stdin correctly', async () => {
		(getStdin as jest.MockedFunction<typeof getStdin>).mockResolvedValue(
			DUMMY_INPUT
		);
		const Prompt = await PromptModule.create();
		expect(Prompt.getFile).toBe(undefined);
		expect(Prompt.getFlags.fromClipboard).toBe(false);
		expect(Prompt.getInput).toBe(DUMMY_INPUT);
	});
});
