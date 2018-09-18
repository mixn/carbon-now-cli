// Packages
const inquirer = require('inquirer');

// Helpers
const carbonMap = require('./helpers/carbon-map.json');
const {LATEST_PRESET} = require('./helpers/globals');

module.exports = async () => {
	const answers = await inquirer
		.prompt([
			{
				type: 'list',
				name: 't',
				message: 'Syntax theme:',
				default: '3024 Night',
				choices: Object.keys(carbonMap.t)
			},
			{
				type: 'list',
				name: 'wt',
				message: 'Window theme:',
				default: 'none',
				choices: Object.keys(carbonMap.wt)
			},
			{
				type: 'list',
				name: 'fm',
				message: 'Font family:',
				default: 'Hack',
				choices: Object.keys(carbonMap.fm)
			},
			{
				type: 'input',
				name: 'fs',
				message: 'Font size:',
				default: '18px'
			},
			{
				type: 'input',
				name: 'bg',
				message: 'Background color:',
				default: '#ADB7C1'
			},
			{
				type: 'confirm',
				name: 'wc',
				message: 'Include window controls?',
				default: true
			},
			{
				type: 'confirm',
				name: 'ln',
				message: 'Include line numbers?',
				default: false
			},
			{
				type: 'confirm',
				name: 'wa',
				message: 'Auto adjust width?',
				default: true
			},
			{
				type: 'input',
				name: 'lh',
				message: 'Line height:',
				default: '133%'
			},
			{
				type: 'input',
				name: 'pv',
				message: 'Vertical padding',
				default: '0px'
			},
			{
				type: 'input',
				name: 'ph',
				message: 'Horizontal padding',
				default: '0px'
			},
			{
				type: 'confirm',
				name: 'ds',
				message: 'Include drop shadow?',
				default: false
			},
			{
				type: 'input',
				name: 'dsyoff',
				message: 'Drop shadow y-offset',
				default: '20px',
				when: answers => answers.ds
			},
			{
				type: 'input',
				name: 'dsblur',
				message: 'Drop shadow blur',
				default: '68px',
				when: answers => answers.ds
			},
			{
				type: 'confirm',
				name: 'si',
				message: 'Make squared image?',
				default: false
			},
			{
				type: 'confirm',
				name: 'wm',
				message: 'Add Carbon watermark?',
				default: false
			},
			{
				type: 'list',
				name: 'es',
				message: 'Export size',
				default: '2x',
				choices: Object.keys(carbonMap.es)
			},
			{
				type: 'list',
				name: 'type',
				message: 'Export as…',
				default: 'png',
				choices: ['png', 'svg']
			},
			{
				type: 'input',
				name: 'imgWidth',
				message: 'If resize is set to true, target width (dont include px)',
				default: '640',
			},
			{
				type: 'confirm',
				name: 'save',
				message: 'Save these settings as a preset?',
				default: false
			},
			{
				type: 'input',
				name: 'preset',
				message: 'Name of the preset? Use kebab-case.',
				default: LATEST_PRESET,
				when: answers => answers.save
			}
		]);

	// Prepare: turn user-friendly, readable input into Carbon-friendly input
	for (const identifier in answers) {
		if (Object.prototype.hasOwnProperty.call(answers, identifier)) {
			// Current answer, e.g. `anwsers['t']`
			const answer = answers[identifier];
			// See if e.g. `t` is present in `carbonMap`
			// Specifically not using `identifier in carbonMap` here
			// cause of multiple uses of `exist`
			const exists = carbonMap[identifier];

			// Overwrite e.g. `Tomorrow Night` with `tomorrow-night-bright`
			// if `t` exists in `carbonMap`
			answers[identifier] = exists ? exists[answer] : answer;
		}
	}

	return answers;
};
