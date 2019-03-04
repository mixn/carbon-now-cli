// Packages
import test from 'ava';

// Source
import process from '../src/process-content';

// Util
import readFileAsync from '../src/util/readfile-async';

test('Correctly processes full length of files', async t => {
	const [js, rust, html] = [
		'./test/test-dummies/_unfold.js',
		'./test/test-dummies/_main.rs',
		'./test/test-dummies/_index.html'
	];
	let expected;

	try {
		// TODO: Make this better
		expected = await readFileAsync(js);
		t.is(await process(expected), expected);

		expected = await readFileAsync(rust);
		t.is(await process(expected), expected);

		expected = await readFileAsync(html);
		t.is(await process(expected), expected);
	} catch (error) {
		t.fail();
	}
});

test('Correctly processes in between given lines', async t => {
	const [full, partial] = [
		'./test/test-dummies/_unfold.js',
		'./test/test-dummies/_unfold-partial.js'
	];

	try {
		t.is(
			await process(await readFileAsync(full), 3, 6),
			await readFileAsync(partial)
		);
	} catch (error) {
		t.fail();
	}
});
