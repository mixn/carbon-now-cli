import { deleteAsync } from 'del';
import fileExists from 'file-exists';
import { readFileSync } from 'jsonfile';
import PresetHandlerModule from '../../src/modules/preset-handler.module.js';
import { CONFIG_LATEST_PRESET } from '../../src/helpers/cli/constants.helper.js';
import {
  CONFIG_DUMMY_PATH,
  CONFIG_MISSING_PRESET,
  DUMMY_CONFIG,
} from '../helpers/constants.helper.js';
import presetMissingView from '../../src/views/preset-missing.view.js';
import { describe, afterAll, it, expect, vi } from 'vitest';

const DUMMY_PRESET_NAME_1 = 'dummy-preset';
const DUMMY_PRESET_NAME_2 = 'appended-dummy-preset';
const DUMMY_PRESET_SETTINGS = {
  t: 'seti',
  bg: 'none',
  fm: 'Hack',
};
const deleteDummy = async () => {
  await deleteAsync([CONFIG_DUMMY_PATH], {
    force: true, // Allow deleting outside of cwd
  });
};

afterAll(async () => await deleteDummy());

describe('PresetHandlerModule', () => {
  it('should create config file if one doesn’t exist', async () => {
    expect(await fileExists(CONFIG_DUMMY_PATH)).toBe(false);
    await new PresetHandlerModule(CONFIG_DUMMY_PATH).savePreset(
      DUMMY_PRESET_NAME_1,
      DUMMY_PRESET_SETTINGS,
    );
    expect(await fileExists(CONFIG_DUMMY_PATH)).toBe(true);
  });

  it('should get an existing preset correctly', async () => {
    expect(
      await new PresetHandlerModule(CONFIG_DUMMY_PATH).getPreset(
        DUMMY_PRESET_NAME_1,
      ),
    ).toEqual(DUMMY_PRESET_SETTINGS);
  });

  it('should append a new preset to an existing config file correctly', async () => {
    await new PresetHandlerModule(CONFIG_DUMMY_PATH).savePreset(
      DUMMY_PRESET_NAME_2,
      DUMMY_PRESET_SETTINGS,
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
      CONFIG_DUMMY_PATH,
    ).getPreset(DUMMY_PRESET_NAME_1);
    expect(nonExistentPreset).toEqual({});
  });

  it('should return empty preset when no matching preset is found', async () => {
    const nonExistentPreset = await new PresetHandlerModule(
      CONFIG_DUMMY_PATH,
    ).getPreset(CONFIG_MISSING_PRESET);
    expect(nonExistentPreset).toEqual({});
  });

  it('should warn user correctly when no matching preset is found', async () => {
    const consoleWarn = vi.spyOn(console, 'warn');
    await new PresetHandlerModule(CONFIG_DUMMY_PATH).getPreset(
      CONFIG_MISSING_PRESET,
    );
    expect(consoleWarn).toHaveBeenCalled();
    expect(consoleWarn).toHaveBeenCalledWith(
      presetMissingView(CONFIG_MISSING_PRESET),
    );
    consoleWarn.mockReset();
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
      await new PresetHandlerModule(DUMMY_CONFIG).getPreset(
        DUMMY_PRESET_NAME_1,
      ),
    ).toEqual({
      theme: 'base16-light',
      backgroundColor: 'white',
      windowTheme: 'none',
      windowControls: true,
      fontFamily: 'Space Mono',
      fontSize: '18px',
      lineNumbers: false,
      firstLineNumber: 1,
      selectedLines: '*',
      dropShadow: false,
      dropShadowOffsetY: '20px',
      dropShadowBlurRadius: '68px',
      widthAdjustment: true,
      lineHeight: '140%',
      paddingVertical: '35px',
      paddingHorizontal: '35px',
      squaredImage: false,
      watermark: false,
      exportSize: '2x',
      type: 'png',
    });
  });
});
