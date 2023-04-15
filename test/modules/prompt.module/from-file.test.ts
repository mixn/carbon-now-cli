import PromptModule from '../../../src/modules/prompt.module.js';
import readFileAsync from '../../../src/utils/read-file-async.util.js';
import { DUMMY_FILE } from '../../helpers/constants.helper.js';

jest.mock('get-stdin');

process.argv.push(DUMMY_FILE);

describe('PromptModule via <file>', () => {
	it('should handle input from <file> correctly', async () => {
		const Prompt = await PromptModule.create();
		expect(Prompt.getFile).toBe(DUMMY_FILE);
		expect(Prompt.getInput).toBe(await readFileAsync(DUMMY_FILE));
	});
});
