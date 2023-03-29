type CarbonThemes = 'seti';
type CarbonFontFamilies = 'Hack';
interface CarbonCLIPresetInterface {
	t: CarbonThemes;
	bg: string;
	wt: 'none' | 'sharp' | 'bw';
	wc: boolean;
	fm: CarbonFontFamilies;
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
	type: 'png' | 'svg';
}

export type CarbonCLIPreset = CarbonCLIPresetInterface | {};
export interface CarbonCLIConfig {
	[key: string]: CarbonCLIPreset;
}
export interface CarbonCLIPromptAnswersInterface
	extends Omit<CarbonCLIPresetInterface, 'dsyoff' | 'dsblur'> {
	dsyoff?: string;
	dsblur?: string;
	save: boolean;
	preset: string;
	l: 'auto';
}
