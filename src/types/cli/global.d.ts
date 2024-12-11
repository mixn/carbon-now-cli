declare type CarbonCLIThemeType =
  | '3024 Night'
  | 'A11y Dark'
  | 'Blackboard'
  | 'Base 16 (Dark)'
  | 'Base 16 (Light)'
  | 'Cobalt'
  | 'Dracula'
  | 'Duotone'
  | 'Hopscotch'
  | 'Lucario'
  | 'Material'
  | 'Monokai'
  | 'Night Owl'
  | 'Nord'
  | 'Oceanic Next'
  | 'One Light'
  | 'One Dark'
  | 'Panda'
  | 'Paraiso'
  | 'Seti'
  | 'Shades of Purple'
  | 'Solarized (Dark)'
  | 'Solarized (Light)'
  | 'SynthWave 84'
  | 'Twilight'
  | 'Verminal'
  | 'VSCode'
  | 'Yeti'
  | 'Zenburn';
declare type CarbonCLIDownloadType = 'png' | 'svg';
type CarbonWindowThemeType = 'none' | 'sharp' | 'bw';
interface CarbonCLIPresetInterface {
  theme: CarbonThemeType;
  backgroundColor: string;
  windowTheme: CarbonWindowThemeType;
  windowControls: boolean;
  fontFamily: CarbonFontFamilyType;
  fontSize: string;
  lineNumbers: boolean;
  firstLineNumber: number;
  dropShadow: boolean;
  dropShadowOffsetY: string;
  dropShadowBlurRadius: string;
  selectedLines: string;
  widthAdjustment: boolean;
  width?: string;
  lineHeight: string;
  paddingVertical: string;
  paddingHorizontal: string;
  squaredImage: boolean;
  watermark: boolean;
  exportSize: '1x' | '2x' | '4x';
  type: CarbonCLIDownloadType;
  code?: string;
  // TODO: Better typing for languages based on extensions-map.helper.ts
  language?: string;
  titleBar?: string;
  presetName?: string;
  custom?: CarbonThemeHighlightsInterface;
}
declare type CarbonCLIPresetType = CarbonCLIPresetInterface | {};
declare interface CarbonCLIConfigInterface {
  [key: string]: CarbonCLIPresetInterface;
}
declare interface CarbonCLIPromptAnswersInterface
  extends CarbonCLIPresetInterface {
  dropShadowOffsetY?: string;
  dropShadowBlurRadius?: string;
  highlight: string;
  theme: CarbonCLIThemeType;
  windowTheme: 'None' | 'Sharp' | 'Black & White';
  fontFamily: CarbonFontFamilyType;
  save: boolean;
  presetName: string;
  language: 'auto';
}
declare type CarbonCLIPromptAnswersType = CarbonCLIPromptAnswersInterface | {};
declare interface CarbonCLIPromptAnswersMappedInterface
  extends CarbonCLIPromptAnswersInterface {
  theme: CarbonThemeType;
  windowTheme: CarbonWindowThemeType;
  fontFamily: CarbonFontFamilyType;
  language?: string;
  presetName?: string;
  save?: boolean;
}
declare enum CarbonCLIEngineFlagEnum {
  chromium = 'chromium',
  firefox = 'firefox',
  webkit = 'webkit',
}

declare type CarbonCLIPromptAnswersMappedType =
  | CarbonCLIPromptAnswersMappedInterface
  | {};
declare interface CarbonCLIFlagsInterface {
  start: number;
  end: number;
  openInBrowser: boolean;
  saveTo: string;
  saveAs?: string;
  interactive: boolean;
  preset: string;
  toClipboard: boolean;
  config: string;
  settings: string;
  fromClipboard: boolean;
  disableHeadless: boolean;
  engine: CarbonCLIEngineFlagEnum;
  skipDisplay: boolean;
}
declare type CarbonCLIPresetAndAnswersIntersectionType =
  CarbonCLIPromptAnswersInterface & CarbonCLIPresetInterface;
declare interface CarbonCLISettingsToQueryParamsMapInterface {
  backgroundColor: 'bg';
  dropShadow: 'ds';
  dropShadowBlurRadius: 'dsblur';
  dropShadowOffsetY: 'dsyoff';
  exportSize: 'es';
  firstLineNumber: 'fl';
  fontFamily: 'fm';
  fontSize: 'fs';
  lineHeight: 'lh';
  language: string | 'auto';
  lineNumbers: 'ln';
  paddingHorizontal: 'ph';
  paddingVertical: 'pv';
  selectedLines: 'sl';
  squaredImage: 'si';
  theme: 't';
  titleBar: 'tb';
  watermark: 'wm';
  widthAdjustment: 'wa';
  width: 'width';
  windowControls: 'wc';
  windowTheme: 'wt';
}
