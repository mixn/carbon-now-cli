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
  t: CarbonThemeType;
  bg: string;
  wt: CarbonWindowThemeType;
  wc: boolean;
  fm: CarbonFontFamilyType;
  fs: string;
  ln: boolean;
  ds: boolean;
  dsyoff: string;
  dsblur: string;
  wa: boolean;
  lh: string;
  pv: string;
  ph: string;
  si: boolean;
  wm: boolean;
  es: '1x' | '2x' | '4x';
  type: CarbonCLIDownloadType;
  preset?: string;
}
declare type CarbonCLIPresetType = CarbonCLIPresetInterface | {};
declare interface CarbonCLIConfigInterface {
  [key: string]: CarbonCLIPresetInterface;
}
declare interface CarbonCLIPromptAnswersInterface
  extends CarbonCLIPresetInterface {
  dsyoff?: string;
  dsblur?: string;
  t: CarbonCLIThemeType;
  wt: 'None' | 'Sharp' | 'Black & White';
  fm: CarbonFontFamilyType;
  save: boolean;
  preset: string;
  l: 'auto';
}
declare type CarbonCLIPromptAnswersType = CarbonCLIPromptAnswersInterface | {};
declare interface CarbonCLIPromptAnswersMappedInterface
  extends CarbonCLIPromptAnswersInterface {
  t: CarbonThemeType;
  wt: CarbonWindowThemeType;
  fm: CarbonFontFamilyType;
  l?: string;
  preset?: string;
  save?: boolean;
}
declare type CarbonCLIPromptAnswersMappedType =
  | CarbonCLIPromptAnswersMappedInterface
  | {};
declare interface CarbonCLIFlagsInterface {
  start: number;
  end: number;
  open: boolean;
  location: string;
  target?: string;
  interactive: boolean;
  preset: string;
  copy: boolean;
  config: string;
  fromClipboard: boolean;
  headless: boolean;
}
declare type CarbonCLIPresetAndAnswersIntersectionType =
  CarbonCLIPromptAnswersInterface & CarbonCLIPresetInterface;
declare type CarbonCLIPromptAnswersOptionalInterface =
  | CarbonCLIPromptAnswersInterface
  | {};
