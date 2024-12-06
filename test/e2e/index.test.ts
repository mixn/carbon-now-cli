import { execaCommand } from 'execa';
import { deleteAsync } from 'del';
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

const SCRIPT = 'npx tsx ./cli.ts';
const DEFAULT_SCRIPT = `${SCRIPT} ${DUMMY_FILE}`;
const DUMMY_LOCATION = 'location';
const DUMMY_SAVED_FILE_NAME = `${DUMMY_TARGET}.png`;
const ABSENT_DUMMY_CONFIG = './non-existent.json';

afterEach(async () => {
  await deleteAsync([DUMMY_SAVED_FILE_NAME], {
    force: true, // Allow deleting outside of cwd
  });
});

afterAll(async () => {
  await deleteAsync([DUMMY_LOCATION], {
    force: true,
  });
});

describe('Running `carbon-now` command', () => {
  it.sequential('should fail without <file> or stdin', async () => {
    try {
      // https://github.com/sindresorhus/get-stdin/issues/13#issuecomment-279234249
      const command = exec(`${SCRIPT}`);
      command.childProcess.stdin?.end();
      await command;
    } catch (error) {}
  });

  it.sequential('should handle --save-as correctly', async () => {
    expect(await fileExists(DUMMY_SAVED_FILE_NAME)).toBe(false);
    await execaCommand(`${DEFAULT_SCRIPT} --save-as ${DUMMY_TARGET}`);
    expect(await fileExists(DUMMY_SAVED_FILE_NAME)).toBe(true);
  });

  it.sequential(
    'shouldn’t create a config when local --config is provided',
    async () => {
      await execaCommand(
        `${DEFAULT_SCRIPT} --config ${ABSENT_DUMMY_CONFIG} --save-as ${DUMMY_TARGET}`,
      );
      expect(await fileExists(ABSENT_DUMMY_CONFIG)).toBe(false);
    },
  );

  it.sequential(
    'shouldn’t modify local --config, but instead treat it as read-only',
    async () => {
      const CONFIG_BEFORE = await readFileAsync(DUMMY_CONFIG);
      await execaCommand(
        `${DEFAULT_SCRIPT} --config ${DUMMY_CONFIG} --save-as ${DUMMY_TARGET}`,
      );
      const CONFIG_AFTER = await readFileAsync(DUMMY_CONFIG);
      expect(CONFIG_BEFORE).toBe(CONFIG_AFTER);
    },
  );

  it.sequential(
    'shouldn’t fail when --end is larger than --start',
    async () => {
      await execaCommand(
        `${DEFAULT_SCRIPT} --start 2 --end 10 --save-as ${DUMMY_TARGET}`,
      );
      expect(await fileExists(DUMMY_SAVED_FILE_NAME)).toBe(true);
    },
  );

  it.sequential(
    'should save to temporary system folder when --to-clipboard is provided',
    async () => {
      await execaCommand(
        `${DEFAULT_SCRIPT} --to-clipboard --save-as ${DUMMY_TARGET}`,
      );
      expect(await fileExists(DUMMY_SAVED_FILE_NAME)).toBe(false);
    },
  );

  it.sequential(
    'shouldn’t download an image when --open-in-browser is provided',
    async () => {
      await execaCommand(
        `${DEFAULT_SCRIPT} --open-in-browser --save-as ${DUMMY_TARGET}`,
      );
      expect(await fileExists(DUMMY_SAVED_FILE_NAME)).toBe(false);
    },
  );

  it.sequential('should handle --save-to correctly', async () => {
    await mkdir(DUMMY_LOCATION);
    await execaCommand(
      `${DEFAULT_SCRIPT} --save-to ./${DUMMY_LOCATION} --save-as ${DUMMY_TARGET}`,
    );
    expect(
      await fileExists(`./${DUMMY_LOCATION}/${DUMMY_SAVED_FILE_NAME}`),
    ).toBe(true);
    await deleteAsync(DUMMY_LOCATION);
  });

  it.sequential('should handle --from-clipboard correctly', async () => {
    clipboard.writeSync(DUMMY_INPUT);
    await execaCommand(`${SCRIPT} --from-clipboard --save-as ${DUMMY_TARGET}`);
    expect(await fileExists(DUMMY_SAVED_FILE_NAME)).toBe(true);
  });
});
