declare type CarbonThemeType =
  | '3024-night'
  | 'a11y-dark'
  | 'blackboard'
  | 'base16-dark'
  | 'base16-light'
  | 'cobalt'
  | 'dracula-pro'
  | 'duotone-dark'
  | 'hopscotch'
  | 'lucario'
  | 'material'
  | 'monokai'
  | 'night-owl'
  | 'nord'
  | 'oceanic-next'
  | 'one-light'
  | 'one-dark'
  | 'panda-syntax'
  | 'paraiso-dark'
  | 'seti'
  | 'shades-of-purple'
  | 'solarized dark'
  | 'solarized light'
  | 'synthwave-84'
  | 'twilight'
  | 'verminal'
  | 'vscode'
  | 'yeti'
  | 'zenburn';
declare type CarbonFontFamilyType =
  | 'Anonymous Pro'
  | 'Cascadia Code'
  | 'Droid Sans Mono'
  | 'Fantasque Sans Mono'
  | 'Fira Code'
  | 'Hack'
  | 'IBM Plex Mono'
  | 'Inconsolata'
  | 'JetBrains Mono'
  | 'Monoid'
  | 'Source Code Pro'
  | 'Space Mono'
  | 'Ubuntu Mono';
declare type CarbonCustomThemeNameType = 'carbon-now-cli-theme';
declare interface CarbonThemeHighlightsInterface {
  background?: string;
  text?: string;
  variable?: string;
  variable2?: string;
  variable3?: string;
  attribute?: string;
  definition?: string;
  keyword?: string;
  operator?: string;
  property?: string;
  number?: string;
  string?: string;
  comment?: string;
  meta?: string;
  tag?: string;
}
declare interface CarbonLocalStorageThemeInterface {
  id: CarbonCustomThemeNameType;
  name: CarbonCustomThemeNameType;
  highlights: CarbonThemeHighlightsInterface;
  custom: typeof true;
}
