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
  lineHeight: string;
  paddingVertical: string;
  paddingHorizontal: string;
  squaredImage: boolean;
  watermark: boolean;
  exportSize: '1x' | '2x' | '4x';
  type: CarbonCLIDownloadType;
  code?: string;
  language?: string;
  preset?: string;
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
  preset: string;
  language: 'auto';
}
declare type CarbonCLIPromptAnswersType = CarbonCLIPromptAnswersInterface | {};
declare interface CarbonCLIPromptAnswersMappedInterface
  extends CarbonCLIPromptAnswersInterface {
  theme: CarbonThemeType;
  windowTheme: CarbonWindowThemeType;
  fontFamily: CarbonFontFamilyType;
  language?: string;
  preset?: string;
  save?: boolean;
}
declare type CarbonCLIPromptAnswersMappedType =
  | CarbonCLIPromptAnswersMappedInterface
  | {};
declare const enum CarbonCLIEngineFlagEnum {
  chromium = 'chromium',
  firefox = 'firefox',
  webkit = 'webkit',
}
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
  fromClipboard: boolean;
  disableHeadless: boolean;
  engine: CarbonCLIEngineFlagEnum;
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
  watermark: 'wm';
  widthAdjustment: 'wa';
  windowControls: 'wc';
  windowTheme: 'wt';
}
