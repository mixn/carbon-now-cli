import clipboardy from 'clipboardy';
import readInput from '../../src/utils/read-input.util.js';
import readFileAsync from '../../src/utils/read-file-async.util.js';

const DUMMY_FILE = './test/test-dummies/_unfold.js';
const DUMMY_INPUT = '<owen-wilson says="Wow" />';

test('Reads file content correctly when input source is <file>', async () => {
	expect(await readInput(DUMMY_FILE)).toBe(await readFileAsync(DUMMY_FILE));
});

test('Reads from clipboard correctly when --from-clipboard flag is set', async () => {
	clipboardy.writeSync(DUMMY_INPUT);
	expect(await readInput(undefined, true)).toBe(clipboardy.readSync());
});

test('Throws an error when no input source exists', async () => {
	await expect(readInput(undefined)).rejects.toEqual('No file or stdin given.');
});
