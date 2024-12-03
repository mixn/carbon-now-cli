import mock from 'mock-fs';
import fileExists from 'file-exists';
import FileHandlerModule from '../../src/modules/file-handler.module.js';
import readFileAsync from '../../src/utils/read-file-async.util.js';
import extensionsMap from '../../src/helpers/cli/extensions-map.helper.js';
import { DUMMY_DEFAULT_FILE_NAME } from '../helpers/constants.helper.js';
import { describe, it, expect } from 'vitest';

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
      await FileHandler.process((await readFileAsync(full)) as string, 3, 6),
    ).toBe((await readFileAsync(partial)) as string);
    expect(
      await FileHandler.process((await readFileAsync(full)) as string, 1, 3),
    ).toBe(await readFileAsync(differentPartial));
  });

  it('should reject when nonsensical line input given', async () => {
    const file = './test/test-dummies/_unfold.js';
    const FileHandler = new FileHandlerModule();
    await expect(
      FileHandler.process((await readFileAsync(file)) as string, 5, 1),
    ).rejects.toEqual(new Error('Nonsensical line numbers.'));
  });

  it('should return mime type for a given file (extension) correctly', () => {
    for (const [extension, mimeType] of extensionsMap) {
      const FileHandler = new FileHandlerModule(`name.${extension}`);
      expect(FileHandler.getMimeType).toBe(mimeType);
    }
  });

  it('should default to `auto` when a mime type doesn’t exist', () => {
    const FileHandler = new FileHandlerModule(`name.foobar`);
    expect(FileHandler.getMimeType).toBe('auto');
  });

  it('should rename a file correctly', async () => {
    expect(await fileExists(DUMMY_DEFAULT_FILE_NAME)).toBe(false);
    // https://github.com/tschaub/mock-fs#example
    mock({
      [DUMMY_DEFAULT_FILE_NAME]: Buffer.from([8, 6, 7, 5, 3, 0, 9]),
    });
    expect(await fileExists(DUMMY_DEFAULT_FILE_NAME)).toBe(true);
    const FileHandler = new FileHandlerModule();
    await FileHandler.rename(DUMMY_DEFAULT_FILE_NAME, 'updated.png');
    expect(await fileExists(DUMMY_DEFAULT_FILE_NAME)).toBe(false);
    expect(await fileExists('updated.png')).toBe(true);
    mock.restore();
  });
});
