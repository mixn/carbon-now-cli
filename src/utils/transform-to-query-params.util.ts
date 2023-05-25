import _ from 'lodash';

const keyMap: CarbonCLISettingsToQueryParamsMapInterface = {
  backgroundColor: 'bg',
  dropShadow: 'ds',
  dropShadowBlurRadius: 'dsblur',
  dropShadowOffsetY: 'dsyoff',
  exportSize: 'es',
  firstLineNumber: 'fl',
  fontFamily: 'fm',
  fontSize: 'fs',
  language: 'l',
  lineHeight: 'lh',
  lineNumbers: 'ln',
  paddingHorizontal: 'ph',
  paddingVertical: 'pv',
  selectedLines: 'sl',
  squaredImage: 'si',
  theme: 't',
  watermark: 'wm',
  widthAdjustment: 'wa',
  windowControls: 'wc',
  windowTheme: 'wt',
};

export default (settings: CarbonCLIPresetInterface) =>
  _.mapKeys(
    settings,
    (value, key) =>
      keyMap[key as keyof CarbonCLISettingsToQueryParamsMapInterface] || key
  );
