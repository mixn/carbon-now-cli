import tempy from 'tempy';
import fs from 'fs';
import mock from 'mock-fs';
import { nanoid } from 'nanoid';
import fileExists from 'file-exists';
import readFileAsync from '../../src/utils/read-file-async.util.js';
import FileHandlerModule from '../../src/modules/file-handler.module.js';
import extensionsMap from '../../src/helpers/cli/extensions-map.helper.js';
import {
	DUMMY_FILE,
	DUMMY_TARGET,
	DUMMY_LOCATION,
	DUMMY_TEMP_FOLDER,
	DUMMY_DEFAULT_FILE_NAME,
} from '../helpers/constants.helper.js';

jest.mock('nanoid');
jest.mock('tempy');

beforeEach(() => {
	(tempy as jest.Mocked<typeof tempy>).directory.mockReturnValue(
		DUMMY_TEMP_FOLDER
	);
});

describe('FileHandlerModule', () => {
	it('should process full length of files correctly', async () => {
		const [js, rust, html] = [
			'./test/test-dummies/_unfold.js',
			'./test/test-dummies/_main.rs',
			'./test/test-dummies/_index.html',
		];
		let expected;
		const FileHandler = new FileHandlerModule();
		expected = (await readFileAsync(js)) as string;
		expect(await FileHandler.process(expected)).toBe(expected);
		expected = (await readFileAsync(rust)) as string;
		expect(await FileHandler.process(expected)).toBe(expected);
		expected = (await readFileAsync(html)) as string;
		expect(await FileHandler.process(expected)).toBe(expected);
	});

	it('should process in between given lines correctly', async () => {
		const [full, partial, differentPartial] = [
			'./test/test-dummies/_unfold.js',
			'./test/test-dummies/_unfold-partial.js',
			'./test/test-dummies/_unfold-partial-2.js',
		];
		const FileHandler = new FileHandlerModule();
		expect(
			await FileHandler.process((await readFileAsync(full)) as string, 3, 6)
		).toBe((await readFileAsync(partial)) as string);
		expect(
			await FileHandler.process((await readFileAsync(full)) as string, 1, 3)
		).toBe(await readFileAsync(differentPartial));
	});

	it('should reject when nonsensical line input given', async () => {
		const file = './test/test-dummies/_unfold.js';
		const FileHandler = new FileHandlerModule();
		await expect(
			FileHandler.process((await readFileAsync(file)) as string, 5, 1)
		).rejects.toEqual('Nonsensical line numbers.');
	});

	it('should return mime type for a given file (extension) correctly', () => {
		for (const [extension, mimeType] of extensionsMap) {
			const FileHandler = new FileHandlerModule(`name.${extension}`);
			expect(FileHandler.getMimeType).toBe(mimeType);
		}
	});

	it('should return the original file name correctly', () => {
		const FileHandler = new FileHandlerModule(DUMMY_FILE);
		expect(FileHandler.getOriginalFileName).toBe('_unfold');
		const FileHandler2 = new FileHandlerModule();
		expect(FileHandler2.getOriginalFileName).toBe('stdin');
	});

	it('should return the new file name correctly', () => {
		const FileHandler = new FileHandlerModule();
		FileHandler.setFlags = {
			target: DUMMY_TARGET,
		} as CarbonCLIFlagsInterface;
		expect(FileHandler.getNewFileName).toBe(DUMMY_TARGET);
		const FileHandler2 = new FileHandlerModule(DUMMY_FILE);
		FileHandler2.setFlags = {
			target: undefined,
		} as CarbonCLIFlagsInterface;
		// TODO: Type this correctly and get rid of @ts-ignore
		// @ts-ignore
		nanoid.mockReturnValue('123456789');
		expect(FileHandler2.getNewFileName).toBe('_unfold-123456789');
	});

	it('should return the save directory correctly', () => {
		const FileHandler = new FileHandlerModule();
		FileHandler.setFlags = {
			copy: false,
			location: DUMMY_LOCATION,
		} as CarbonCLIFlagsInterface;
		expect(FileHandler.getSaveDirectory).toBe(DUMMY_LOCATION);
		FileHandler.setFlags = {
			copy: true,
			location: DUMMY_LOCATION,
		} as CarbonCLIFlagsInterface;
		expect(FileHandler.getSaveDirectory).toBe(DUMMY_TEMP_FOLDER);
	});

	it('should return the full download path correctly', () => {
		const FileHandler = new FileHandlerModule();
		FileHandler.setImgType = 'png';
		FileHandler.setFlags = {
			copy: false,
			location: DUMMY_LOCATION,
		} as CarbonCLIFlagsInterface;
		expect(FileHandler.getDownloadedAsPath).toBe(
			`${DUMMY_LOCATION}/${DUMMY_DEFAULT_FILE_NAME}`
		);
		FileHandler.setImgType = 'png';
		FileHandler.setFlags = {
			copy: true,
			location: DUMMY_LOCATION,
		} as CarbonCLIFlagsInterface;
		expect(FileHandler.getDownloadedAsPath).toBe(
			`${DUMMY_TEMP_FOLDER}/${DUMMY_DEFAULT_FILE_NAME}`
		);
	});

	it('should return the full saved-to path correctly', () => {
		const FileHandler = new FileHandlerModule();
		FileHandler.setImgType = 'png';
		FileHandler.setFlags = {
			copy: false,
			target: DUMMY_TARGET,
			location: DUMMY_LOCATION,
		} as CarbonCLIFlagsInterface;
		expect(FileHandler.getSavedAsPath).toBe(
			`${DUMMY_LOCATION}/${DUMMY_TARGET}.png`
		);
		FileHandler.setFlags = {
			copy: true,
			target: DUMMY_TARGET,
			location: DUMMY_LOCATION,
		} as CarbonCLIFlagsInterface;
		expect(FileHandler.getSavedAsPath).toBe(
			`${DUMMY_TEMP_FOLDER}/${DUMMY_TARGET}.png`
		);
	});

	it('should return the full, final path correctly', () => {
		const FileHandler = new FileHandlerModule();
		FileHandler.setImgType = 'png';
		FileHandler.setFlags = {
			copy: false,
			target: DUMMY_TARGET,
			location: DUMMY_LOCATION,
		} as CarbonCLIFlagsInterface;
		expect(FileHandler.getPath).toBe(`${DUMMY_LOCATION}/${DUMMY_TARGET}.png`);
		FileHandler.setFlags = {
			copy: true,
			target: DUMMY_TARGET,
			location: DUMMY_LOCATION,
		} as CarbonCLIFlagsInterface;
		expect(FileHandler.getPath).toBe(
			`${DUMMY_TEMP_FOLDER}/${DUMMY_DEFAULT_FILE_NAME}`
		);
		FileHandler.setFlags = {
			copy: false,
			target: undefined,
			location: DUMMY_LOCATION,
		} as CarbonCLIFlagsInterface;
		expect(FileHandler.getPath).toBe(`${DUMMY_LOCATION}/stdin-123456789.png`);
		const FileHandler2 = new FileHandlerModule(DUMMY_FILE);
		FileHandler2.setImgType = 'svg';
		FileHandler2.setFlags = {
			copy: false,
			target: undefined,
			location: DUMMY_LOCATION,
		} as CarbonCLIFlagsInterface;
		expect(FileHandler2.getPath).toBe(
			`${DUMMY_LOCATION}/_unfold-123456789.svg`
		);
	});

	it('should rename a file correctly', async () => {
		expect(await fileExists(DUMMY_DEFAULT_FILE_NAME)).toBe(false);
		// https://github.com/tschaub/mock-fs#example
		mock({
			[DUMMY_DEFAULT_FILE_NAME]: Buffer.from([8, 6, 7, 5, 3, 0, 9]),
		});
		expect(await fileExists(DUMMY_DEFAULT_FILE_NAME)).toBe(true);
		const FileHandler = new FileHandlerModule();
		FileHandler.setImgType = 'png';
		FileHandler.setFlags = {
			copy: false,
			target: undefined,
			location: process.cwd(),
		} as CarbonCLIFlagsInterface;
		expect(await fileExists(FileHandler.getDownloadedAsPath)).toBe(true);
		await FileHandler.rename(
			FileHandler.getDownloadedAsPath,
			FileHandler.getSavedAsPath
		);
		expect(await fileExists(FileHandler.getDownloadedAsPath)).toBe(false);
		expect(await fileExists(FileHandler.getSavedAsPath)).toBe(true);
		mock.restore();
	});
});
