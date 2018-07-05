// Native
import fs from 'fs';
import {promisify} from 'util';

// Packages
import test from 'ava';

// Source
import process from '../src/process-content';

test('Correctly processes entire content', async t => {
	try {
		const readFileAsync = promisify(fs.readFile); // Fixing Ryan’s mistakes… *sigh* https://goo.gl/fMr85g JK gr8 talk m8 I r8 8/8 👍
		const expected = await readFileAsync('./test/test-dummies/_unfold.js', {
			encoding: 'utf8'
		});

		t.is(await process('./test/test-dummies/_unfold.js'), expected);
	} catch (error) {
		t.fail();
	}
});
