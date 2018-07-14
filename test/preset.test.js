// Packages
import test from 'ava';
import del from 'del';
import fileExists from 'file-exists';
import {isEqual} from 'lodash';
import {readFileSync} from 'jsonfile';

// Source
import preset from '../src/preset';
import {FULL_DUMMY_CONFIG_PATH} from '../src/helpers/globals';

const DUMMY_PRESET_NAME_1 = 'dummy-preset';
const DUMMY_PRESET_NAME_2 = 'appended-dummy-preset';
const DUMMY_PRESET_SETTINGS = {
	t: 'seti',
	bg: 'none',
	fm: 'Hack'
};

const deleteDummy = async () => {
	await del([FULL_DUMMY_CONFIG_PATH], {
		force: true
	});
};

// This test uses a dummy file to not potentially delete meaningful settings
test.serial('Creates .carbon-now-dummy.json if it doesn’t exist', async t => {
	await deleteDummy();

	await preset.save(
		DUMMY_PRESET_NAME_1,
		DUMMY_PRESET_SETTINGS,
		FULL_DUMMY_CONFIG_PATH
	);

	if (await fileExists(FULL_DUMMY_CONFIG_PATH)) {
		t.pass();
	} else {
		t.fail();
	}
});

test.serial('Appends correctly to existing config file', async t => {
	await preset.save(
		DUMMY_PRESET_NAME_2,
		DUMMY_PRESET_SETTINGS,
		FULL_DUMMY_CONFIG_PATH
	);

	const currentConfig = await readFileSync(FULL_DUMMY_CONFIG_PATH);
	const shouldEqual = {
		[DUMMY_PRESET_NAME_1]: DUMMY_PRESET_SETTINGS,
		[DUMMY_PRESET_NAME_2]: DUMMY_PRESET_SETTINGS,
		'last-used-preset': DUMMY_PRESET_SETTINGS
	};

	if (isEqual(currentConfig, shouldEqual)) {
		t.pass();
	} else {
		t.fail();
	}
});

// Cleanup
test.after.always((async () => {
	await deleteDummy();
}));
