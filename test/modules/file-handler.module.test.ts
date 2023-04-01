import readFileAsync from '../../src/utils/read-file-async.util.js';
import FileHandler from '../../src/modules/file-handler.module.js';

test('Should correctly processes full length of files', async () => {
	const [js, rust, html] = [
		'./test/test-dummies/_unfold.js',
		'./test/test-dummies/_main.rs',
		'./test/test-dummies/_index.html',
	];
	let expected;

	expected = await readFileAsync(js);
	expect(await FileHandler.process(expected)).toBe(expected);
	expected = await readFileAsync(rust);
	expect(await FileHandler.process(expected)).toBe(expected);
	expected = await readFileAsync(html);
	expect(await FileHandler.process(expected)).toBe(expected);
});

test('Should correctly process in between given lines', async () => {
	const [full, partial, differentPartial] = [
		'./test/test-dummies/_unfold.js',
		'./test/test-dummies/_unfold-partial.js',
		'./test/test-dummies/_unfold-partial-2.js',
	];
	expect(await FileHandler.process(await readFileAsync(full), 3, 6)).toBe(
		await readFileAsync(partial)
	);
	expect(await FileHandler.process(await readFileAsync(full), 1, 3)).toBe(
		await readFileAsync(differentPartial)
	);
});

test('Should reject when nonsensical line input given', async () => {
	const file = './test/test-dummies/_unfold.js';
	await expect(
		FileHandler.process(await readFileAsync(file), 5, 1)
	).rejects.toEqual('Nonsensical line numbers.');
});
