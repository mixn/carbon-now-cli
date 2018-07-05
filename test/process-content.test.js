// Native
import fs from 'fs';
import {promisify} from 'util';

// Packages
import test from 'ava';

// Source
import process from '../src/process-content';

const readFileAsync = promisify(fs.readFile); // Fixing Ryan’s mistakes… *sigh* https://goo.gl/fMr85g JK gr8 talk m8 I r8 8/8 👍
const readFileAsyncEncoded = file => readFileAsync(file, {
	encoding: 'utf8'
});

test('Correctly processes full length of files', async t => {
	const [js, rust, html] = [
		'./test/test-dummies/_unfold.js',
		'./test/test-dummies/_main.rs',
		'./test/test-dummies/_index.html'
	];
	let expected;

	try {
		// TODO: Make this better
		expected = await readFileAsyncEncoded(js);
		t.is(await process(js), expected);

		expected = await readFileAsyncEncoded(rust);
		t.is(await process(rust), expected);

		expected = await readFileAsyncEncoded(html);
		t.is(await process(html), expected);
	} catch (error) {
		t.fail();
	}
});
