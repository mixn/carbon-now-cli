import clipboard from 'clipboardy';
import Prompt from '../../../src/modules/prompt.module.js';
import { DUMMY_INPUT } from '../../helpers/constants.helper.js';

jest.mock('get-stdin');

process.argv.push('--from-clipboard');

it('Should correctly accept input from clipboard if --from-clipboard is set', async () => {
	clipboard.writeSync(DUMMY_INPUT);
	expect((await Prompt.create()).getFile).toBe(undefined);
	expect((await Prompt.create()).getInput).toBe(DUMMY_INPUT);
});
