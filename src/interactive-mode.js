// Packages
const inquirer = require('inquirer');

// Helpers
const carbonMap = require('./helpers/carbon-map.json');

module.exports = () => {
	return inquirer
		.prompt([
			{
				type: 'list',
				name: 't',
				message: 'Syntax theme:',
				default: 'Seti',
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
			}
		])
		// Prepare: turn user-friendly, readable input into Carbon-friendly input
		.then(answers => {
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
		});
};
