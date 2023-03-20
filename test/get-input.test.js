// Packages
import test from 'ava';
import clipboardy from 'clipboardy';

// Source
import getInput from '../src/get-input';

// Util
import readFileAsync from '../src/util/readfile-async';

const DUMMY_FILE = './test/test-dummies/_unfold.js';
const DUMMY_INPUT = '<owen-wilson says="Wow" />';

test('Gets file content when a file is given', async (t) => {
	t.is(await getInput(DUMMY_FILE), await readFileAsync(DUMMY_FILE));
});

test('Reads from clipboard when --from-clipboard is set', async (t) => {
	clipboardy.writeSync(DUMMY_INPUT);
	t.is(await getInput(undefined, true), clipboardy.readSync());
});
