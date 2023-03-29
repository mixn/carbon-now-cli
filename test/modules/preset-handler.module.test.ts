import del from 'del';
import fileExists from 'file-exists';
import { readFileSync } from 'jsonfile';
import PresetHandler from '../../src/modules/preset-handler.module.js';
import {
	CONFIG_DUMMY_PATH,
	CONFIG_LATEST_PRESET,
} from '../../src/helpers/cli/constants.helper.js';

const DUMMY_PRESET_NAME_1 = 'dummy-preset';
const DUMMY_PRESET_NAME_2 = 'appended-dummy-preset';
const DUMMY_PRESET_SETTINGS = {
	t: 'seti',
	bg: 'none',
	fm: 'Hack',
};
const deleteDummy = async () => {
	await del([CONFIG_DUMMY_PATH], {
		force: true, // Allow deleting outside of cwd
	});
};

afterAll(async () => await deleteDummy());

test('Should create config file if one doesn’t exist', async () => {
	await new PresetHandler(CONFIG_DUMMY_PATH).savePreset(
		DUMMY_PRESET_NAME_1,
		DUMMY_PRESET_SETTINGS
	);
	expect(await fileExists(CONFIG_DUMMY_PATH)).toBe(true);
});

test('Should correctly get an existing preset', async () => {
	expect(
		await new PresetHandler(CONFIG_DUMMY_PATH).getPreset(DUMMY_PRESET_NAME_1)
	).toEqual(DUMMY_PRESET_SETTINGS);
});

test('Should append a new preset correctly to an existing config file', async () => {
	await new PresetHandler(CONFIG_DUMMY_PATH).savePreset(
		DUMMY_PRESET_NAME_2,
		DUMMY_PRESET_SETTINGS
	);
	const currentConfig = await readFileSync(CONFIG_DUMMY_PATH);
	const shouldEqual = {
		[DUMMY_PRESET_NAME_1]: DUMMY_PRESET_SETTINGS,
		[DUMMY_PRESET_NAME_2]: DUMMY_PRESET_SETTINGS,
		[CONFIG_LATEST_PRESET]: DUMMY_PRESET_SETTINGS,
	};
	expect(currentConfig).toEqual(shouldEqual);
});

test('Should return empty preset when config doesn’t exist', async () => {
	await deleteDummy();
	const nonExistentPreset = await new PresetHandler(
		CONFIG_DUMMY_PATH
	).getPreset(DUMMY_PRESET_NAME_1);
	expect(nonExistentPreset).toEqual({});
});

test('Should return empty preset when no matching preset is found', async () => {
	const nonExistentPreset = await new PresetHandler(
		CONFIG_DUMMY_PATH
	).getPreset('nope');
	expect(nonExistentPreset).toEqual({});
});

test('Should handle multiple preset saves correctly', async () => {
	await deleteDummy();
	const PresetHandlerInstance = new PresetHandler(CONFIG_DUMMY_PATH);
	await PresetHandlerInstance.savePreset(DUMMY_PRESET_NAME_1, {
		foo: 'foo',
	});
	await PresetHandlerInstance.savePreset(DUMMY_PRESET_NAME_2, {
		bar: 'bar',
	});
	expect(await readFileSync(CONFIG_DUMMY_PATH)).toEqual({
		[DUMMY_PRESET_NAME_1]: { foo: 'foo' },
		[DUMMY_PRESET_NAME_2]: { bar: 'bar' },
		[CONFIG_LATEST_PRESET]: { bar: 'bar' },
	});
});