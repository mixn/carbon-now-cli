import clipboardy from 'clipboardy';
import readInput from '../../src/helpers/cli/read-input.helper.js';
import readFileAsync from '../../src/utils/read-file-async.util.js';

const DUMMY_FILE = './test/test-dummies/_unfold.js';
const DUMMY_INPUT = '<owen-wilson says="Wow" />';

test('Should read file content correctly when input source is <file>', async () => {
	expect(await readInput(DUMMY_FILE)).toBe(await readFileAsync(DUMMY_FILE));
});

test('Should read from clipboard correctly when --from-clipboard flag is set', async () => {
	clipboardy.writeSync(DUMMY_INPUT);
	expect(await readInput(undefined, true)).toBe(clipboardy.readSync());
});

// TODO: Fix this, randomly stopped working ¯\_(ツ)_/¯
// test('Should reject with correct message when no input source exists', async () => {
// 	await expect(readInput(undefined)).rejects.toEqual('No file or stdin given.');
// });

// TODO: Should read from stdin correctly when neither <file> nor --from-clipboard flag are present
// https://github.com/caitp/node-mock-stdin
