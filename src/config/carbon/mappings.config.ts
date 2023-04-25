type MappingsConfigThemeType = {
  [K in CarbonCLIThemeType]: CarbonThemeType;
};
interface MappingsConfigWindowThemeInterface {
  None: 'none';
  Sharp: 'sharp';
  'Black & White': 'bw';
}
type MappingsConfigFontFamiliesInterface = {
  [K in CarbonFontFamilyType]: CarbonFontFamilyType;
};
interface MappingsConfigExportSizeInterface {
  '2x': '2x';
  '1x': '1x';
  '4x': '4x';
}
interface MappingsConfigInterface {
  t: MappingsConfigThemeType;
  wt: MappingsConfigWindowThemeInterface;
  fm: MappingsConfigFontFamiliesInterface;
  es: MappingsConfigExportSizeInterface;
  [key: string]: any;
}
export type MappingsConfigPropertyType =
  | keyof MappingsConfigThemeType
  | keyof MappingsConfigWindowThemeInterface
  | keyof MappingsConfigFontFamiliesInterface
  | keyof MappingsConfigExportSizeInterface;
export const mappingsConfig: MappingsConfigInterface = {
  t: {
    '3024 Night': '3024-night',
    'A11y Dark': 'a11y-dark',
    'Base 16 (Dark)': 'base16-dark',
    'Base 16 (Light)': 'base16-light',
    Blackboard: 'blackboard',
    Cobalt: 'cobalt',
    Dracula: 'dracula-pro',
    Duotone: 'duotone-dark',
    Hopscotch: 'hopscotch',
    Lucario: 'lucario',
    Material: 'material',
    Monokai: 'monokai',
    'Night Owl': 'night-owl',
    Nord: 'nord',
    'Oceanic Next': 'oceanic-next',
    'One Dark': 'one-dark',
    'One Light': 'one-light',
    Panda: 'panda-syntax',
    Paraiso: 'paraiso-dark',
    Seti: 'seti',
    'Shades of Purple': 'shades-of-purple',
    'Solarized (Dark)': 'solarized dark',
    'Solarized (Light)': 'solarized light',
    'SynthWave 84': 'synthwave-84',
    Twilight: 'twilight',
    VSCode: 'vscode',
    Verminal: 'verminal',
    Yeti: 'yeti',
    Zenburn: 'zenburn',
  },
  wt: {
    None: 'none',
    Sharp: 'sharp',
    'Black & White': 'bw',
  },
  fm: {
    // Although this is technically not needed any more, I’ll leave it in due to
    // potential anomalies that have occured in the past (e. g. 'Dank Mono': dm)
    'Anonymous Pro': 'Anonymous Pro',
    'Cascadia Code': 'Cascadia Code',
    'Droid Sans Mono': 'Droid Sans Mono',
    'Fantasque Sans Mono': 'Fantasque Sans Mono',
    'Fira Code': 'Fira Code',
    Hack: 'Hack',
    'IBM Plex Mono': 'IBM Plex Mono',
    Inconsolata: 'Inconsolata',
    'JetBrains Mono': 'JetBrains Mono',
    Monoid: 'Monoid',
    'Source Code Pro': 'Source Code Pro',
    'Space Mono': 'Space Mono',
    'Ubuntu Mono': 'Ubuntu Mono',
  },
  es: {
    '2x': '2x',
    '1x': '1x',
    '4x': '4x',
  },
};
