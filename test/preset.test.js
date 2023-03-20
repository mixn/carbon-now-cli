// Packages
import test from 'ava';
import del from 'del';
import fileExists from 'file-exists';
import { readFileSync } from 'jsonfile';

// Source
import presetHandler from '../src/preset';
import { FULL_DUMMY_CONFIG_PATH, LATEST_PRESET } from '../src/helpers/globals';

const DUMMY_PRESET_NAME_1 = 'dummy-preset';
const DUMMY_PRESET_NAME_2 = 'appended-dummy-preset';
const DUMMY_PRESET_SETTINGS = {
	t: 'seti',
	bg: 'none',
	fm: 'Hack',
};

const deleteDummy = async () => {
	await del([FULL_DUMMY_CONFIG_PATH], {
		force: true, // This allows deleting outside of cwd
	});
};

// This test uses a dummy file to not potentially delete meaningful settings
// TODO: Probably use https://goo.gl/wAC2Kk and/or https://goo.gl/qqrbjf
test.serial('Creates config file if it doesn’t exist', async (t) => {
	await deleteDummy();

	await presetHandler.save(
		DUMMY_PRESET_NAME_1,
		DUMMY_PRESET_SETTINGS,
		FULL_DUMMY_CONFIG_PATH
	);

	t.true(await fileExists(FULL_DUMMY_CONFIG_PATH));
});

test.serial('Appends preset correctly to existing config file', async (t) => {
	await presetHandler.save(
		DUMMY_PRESET_NAME_2,
		DUMMY_PRESET_SETTINGS,
		FULL_DUMMY_CONFIG_PATH
	);

	const currentConfig = await readFileSync(FULL_DUMMY_CONFIG_PATH);
	const shouldEqual = {
		[DUMMY_PRESET_NAME_1]: DUMMY_PRESET_SETTINGS,
		[DUMMY_PRESET_NAME_2]: DUMMY_PRESET_SETTINGS,
		[LATEST_PRESET]: DUMMY_PRESET_SETTINGS,
	};

	t.deepEqual(currentConfig, shouldEqual);
});

test.serial('Correctly fetches existing preset', async (t) => {
	const fetchedPreset = await presetHandler.get(
		DUMMY_PRESET_NAME_1,
		FULL_DUMMY_CONFIG_PATH
	);

	t.deepEqual(fetchedPreset, DUMMY_PRESET_SETTINGS);
});

test.serial('Allows for non-existent preset', async (t) => {
	await deleteDummy();

	const nonExistentPreset = await presetHandler.get(
		DUMMY_PRESET_NAME_1,
		FULL_DUMMY_CONFIG_PATH
	);

	t.deepEqual(nonExistentPreset, {});
});

// Cleanup
test.after.always(async () => {
	await deleteDummy();
});
