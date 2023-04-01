type CarbonCLIThemes = 'Seti' | '3024 Night';
type CarbonCLIFontFamilies = 'Hack';
type CarbonCLIFlags =
	| 'start'
	| 'end'
	| 'open'
	| 'location'
	| 'target'
	| 'interactive'
	| 'preset'
	| 'config'
	| 'copy'
	| 'fromClipboard'
	| 'headless';
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
declare type MeowOption = {
	type: string;
	alias?: string;
	default?: any;
};

declare type CarbonCLIPreset = CarbonCLIPresetInterface | {};
declare interface CarbonCLIConfig {
	[key: string]: CarbonCLIPreset;
}
// TODO: I don’t think `Omit` is the right utility type here, re-check this
declare interface CarbonCLIPromptAnswersInterface
	extends Omit<CarbonCLIPresetInterface, 'dsyoff' | 'dsblur' | 't' | 'wt'> {
	dsyoff?: string;
	dsblur?: string;
	t: CarbonCLIThemes;
	wt: 'None' | 'Sharp' | 'Black & White';
	fm: CarbonFontFamilies;
	save: boolean;
	preset: string;
	l: 'auto';
}
// TODO: I don’t think `Omit` is the right utility type here, re-check this
declare interface CarbonCLIPromptAnswersMappedInterface
	extends Omit<CarbonCLIPromptAnswersInterface, 't' | 'wt'> {
	t: CarbonThemes;
	wt: 'none' | 'sharp' | 'bw';
	fm: CarbonFontFamilies;
}
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
