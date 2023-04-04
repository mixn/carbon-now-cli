import readFileAsync from '../../src/utils/read-file-async.util.js';
import FileHandler from '../../src/modules/file-handler.module.js';
import extensionsMap from '../../src/helpers/cli/extensions-map.helper.json';

it('Should correctly processes full length of files', async () => {
	const [js, rust, html] = [
		'./test/test-dummies/_unfold.js',
		'./test/test-dummies/_main.rs',
		'./test/test-dummies/_index.html',
	];
	let expected;
	const FileHandlerInstance = new FileHandler();
	expected = await readFileAsync(js);
	expect(await FileHandlerInstance.process(expected)).toBe(expected);
	expected = await readFileAsync(rust);
	expect(await FileHandlerInstance.process(expected)).toBe(expected);
	expected = await readFileAsync(html);
	expect(await FileHandlerInstance.process(expected)).toBe(expected);
});

it('Should correctly process in between given lines', async () => {
	const [full, partial, differentPartial] = [
		'./test/test-dummies/_unfold.js',
		'./test/test-dummies/_unfold-partial.js',
		'./test/test-dummies/_unfold-partial-2.js',
	];
	const FileHandlerInstance = new FileHandler();
	expect(
		await FileHandlerInstance.process(await readFileAsync(full), 3, 6)
	).toBe(await readFileAsync(partial));
	expect(
		await FileHandlerInstance.process(await readFileAsync(full), 1, 3)
	).toBe(await readFileAsync(differentPartial));
});

it('Should reject when nonsensical line input given', async () => {
	const file = './test/test-dummies/_unfold.js';
	const FileHandlerInstance = new FileHandler();
	await expect(
		FileHandlerInstance.process(await readFileAsync(file), 5, 1)
	).rejects.toEqual('Nonsensical line numbers.');
});

it('Should correctly return mime type for a given file (extension)', () => {
	for (const [extension, mimeType] of extensionsMap) {
		const FileHandlerInstance = new FileHandler(`name.${extension}`);
		expect(FileHandlerInstance.getMimeType).toBe(mimeType);
	}
});
