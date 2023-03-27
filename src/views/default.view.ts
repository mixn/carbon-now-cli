import chalk from 'chalk';

export default `
	${chalk.bold('Usage')}
		$ carbon-now <file>
		$ pbpaste | carbon-now
		$ carbon-now --from-clipboard

	${chalk.bold('Options')}
		-s, --start          Starting line of <file>
		-e, --end            Ending line of <file>
		-i, --interactive    Interactive mode
		-l, --location       Image save location, default: cwd
		-t, --target         Image name, default: original-hash.{png|svg}
		-o, --open           Open in browser instead of saving
		-c, --copy           Copy image to clipboard
		-p, --preset         Use a saved preset
		-h, --headless       Use only non-experimental Puppeteer features
		--config             Use a different, local config (read-only)
		--from-clipboard     Read input from clipboard instead of file

	${chalk.bold('Examples')}
		See: https://github.com/mixn/carbon-now-cli#examples
`;
