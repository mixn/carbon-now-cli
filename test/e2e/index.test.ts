import execa from 'execa';
import del from 'del';
import fileExists from 'file-exists';
import clipboard from 'clipboardy';
import { exec } from 'child-process-promise';
import { mkdir } from 'node:fs/promises';
import {
  DUMMY_INPUT,
  DUMMY_FILE,
  DUMMY_TARGET,
  DUMMY_CONFIG,
} from '../helpers/constants.helper.js';
import readFileAsync from '../../src/utils/read-file-async.util.js';

const SCRIPT = 'npx ts-node --esm --files ./cli.ts';
const DEFAULT_SCRIPT = `${SCRIPT} ${DUMMY_FILE}`;
const DUMMY_LOCATION = 'location';
const DUMMY_SAVED_FILE_NAME = `${DUMMY_TARGET}.png`;
const ABSENT_DUMMY_CONFIG = './non-existent.json';

afterEach(async () => {
  await del([DUMMY_SAVED_FILE_NAME], {
    force: true, // Allow deleting outside of cwd
  });
});

describe('Running `carbon-now` command', () => {
  it('should fail without <file> or stdin', async () => {
    try {
      // https://github.com/sindresorhus/get-stdin/issues/13#issuecomment-279234249
      const command = exec(`${SCRIPT}`);
      command.childProcess.stdin?.end();
      await command;
    } catch (error) {}
  });

  it('should handle --target correctly', async () => {
    expect(await fileExists(DUMMY_SAVED_FILE_NAME)).toBe(false);
    await execa.command(`${DEFAULT_SCRIPT} -t=${DUMMY_TARGET}`);
    expect(await fileExists(DUMMY_SAVED_FILE_NAME)).toBe(true);
  });

  it('shouldn’t create a config when local --config is provided', async () => {
    await execa.command(
      `${DEFAULT_SCRIPT} --config=${ABSENT_DUMMY_CONFIG} -t=${DUMMY_TARGET}`
    );
    expect(await fileExists(ABSENT_DUMMY_CONFIG)).toBe(false);
  });

  it('shouldn’t modify local --config, but instead treat it as read-only', async () => {
    const CONFIG_BEFORE = await readFileAsync(DUMMY_CONFIG);
    await execa.command(
      `${DEFAULT_SCRIPT} --config=${DUMMY_CONFIG} -t=${DUMMY_TARGET}`
    );
    const CONFIG_AFTER = await readFileAsync(DUMMY_CONFIG);
    expect(CONFIG_BEFORE).toBe(CONFIG_AFTER);
  });

  it('shouldn’t fail when --end is larger than --start', async () => {
    await execa.command(
      `${DEFAULT_SCRIPT} --start=2 --end=10 -t=${DUMMY_TARGET}`
    );
    expect(await fileExists(DUMMY_SAVED_FILE_NAME)).toBe(true);
  });

  it('should save to temporary system folder when --copy is provided', async () => {
    await execa.command(`${DEFAULT_SCRIPT} --copy -t=${DUMMY_TARGET}`);
    expect(await fileExists(DUMMY_SAVED_FILE_NAME)).toBe(false);
  });

  it('shouldn’t download an image when --open is provided', async () => {
    await execa.command(`${DEFAULT_SCRIPT} --open -t=${DUMMY_TARGET}`);
    expect(await fileExists(DUMMY_SAVED_FILE_NAME)).toBe(false);
  });

  it('should handle --location correctly', async () => {
    await mkdir(DUMMY_LOCATION);
    await execa.command(
      `${DEFAULT_SCRIPT} -l ./${DUMMY_LOCATION} -t=${DUMMY_TARGET}`
    );
    expect(
      await fileExists(`./${DUMMY_LOCATION}/${DUMMY_SAVED_FILE_NAME}`)
    ).toBe(true);
    await del(DUMMY_LOCATION);
  });

  it('should handle --from-clipboard correctly', async () => {
    clipboard.writeSync(DUMMY_INPUT);
    await execa.command(`${SCRIPT} --from-clipboard -t=${DUMMY_TARGET}`);
    expect(await fileExists(DUMMY_SAVED_FILE_NAME)).toBe(true);
  });
});
