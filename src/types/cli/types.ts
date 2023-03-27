type CarbonLanguages = 'seti';
type CarbonFontFamilies = 'Hack';

export interface CarbonCLIPreset {
	t: CarbonLanguages;
	l: 'auto';
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

export interface CarbonCLIConfig {
	[key: string]: CarbonCLIPreset;
}
