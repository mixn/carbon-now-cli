import meow from 'meow';
import defaultView from '../../views/default.view.js';
import flags from '../../config/cli/flags.config.js';

const cli = meow(defaultView, {
	importMeta: import.meta,
	flags,
});

export const [CLI_FILE] = cli.input;
export const {
	start: FLAG_START,
	end: FLAG_END,
	open: FLAG_OPEN,
	location: FLAG_LOCATION,
	target: FLAG_TARGET,
	copy: FLAG_COPY,
	interactive: FLAG_INTERACTIVE,
	preset: FLAG_PRESET,
	config: FLAG_CONFIG,
	fromClipboard: FLAG_FROM_CLIPBOARD,
	headless: FLAG_HEADLESS,
} = cli.flags;
