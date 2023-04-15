import del from 'del';
import fileExists from 'file-exists';
import { readFileSync } from 'jsonfile';
import PresetHandlerModule from '../../src/modules/preset-handler.module.js';
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

describe('PresetHandlerModule', () => {
	it('should create config file if one doesn’t exist', async () => {
		await new PresetHandlerModule(CONFIG_DUMMY_PATH).savePreset(
			DUMMY_PRESET_NAME_1,
			DUMMY_PRESET_SETTINGS
		);
		expect(await fileExists(CONFIG_DUMMY_PATH)).toBe(true);
	});

	it('should get an existing preset correctly', async () => {
		expect(
			await new PresetHandlerModule(CONFIG_DUMMY_PATH).getPreset(
				DUMMY_PRESET_NAME_1
			)
		).toEqual(DUMMY_PRESET_SETTINGS);
	});

	it('should append a new preset to an existing config file correctly', async () => {
		await new PresetHandlerModule(CONFIG_DUMMY_PATH).savePreset(
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

	it('should return an empty preset when a config doesn’t exist', async () => {
		await deleteDummy();
		const nonExistentPreset = await new PresetHandlerModule(
			CONFIG_DUMMY_PATH
		).getPreset(DUMMY_PRESET_NAME_1);
		expect(nonExistentPreset).toEqual({});
	});

	it('should return empty preset when no matching preset is found', async () => {
		const nonExistentPreset = await new PresetHandlerModule(
			CONFIG_DUMMY_PATH
		).getPreset('nope');
		expect(nonExistentPreset).toEqual({});
	});

	it('should handle multiple preset saves correctly', async () => {
		await deleteDummy();
		const PresetHandler = new PresetHandlerModule(CONFIG_DUMMY_PATH);
		await PresetHandler.savePreset(DUMMY_PRESET_NAME_1, {
			foo: 'foo',
		});
		await PresetHandler.savePreset(DUMMY_PRESET_NAME_2, {
			bar: 'bar',
		});
		expect(await readFileSync(CONFIG_DUMMY_PATH)).toEqual({
			[DUMMY_PRESET_NAME_1]: { foo: 'foo' },
			[DUMMY_PRESET_NAME_2]: { bar: 'bar' },
			[CONFIG_LATEST_PRESET]: { bar: 'bar' },
		});
	});

	it('should handle local configs correctly', async () => {
		expect(
			await new PresetHandlerModule(
				'./test/test-dummies/_config.json'
			).getPreset(DUMMY_PRESET_NAME_1)
		).toEqual({
			bg: 'white',
			ds: true,
			dsblur: '5px',
			dsyoff: '5px',
			es: '2x',
			fm: 'Inconsolata',
			fs: '16px',
			lh: '133%',
			ln: false,
			ph: '20px',
			pv: '20px',
			si: false,
			t: 'base16-light',
			type: 'png',
			wa: true,
			wc: true,
			wm: false,
			wt: 'none',
		});
	});
});
