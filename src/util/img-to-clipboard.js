// Packages
const execa = require('execa');

module.exports = async (imgPath) => {
	const OS = process.platform;
	let SCRIPT;

	switch (OS) {
		case 'darwin': {
			SCRIPT = `osascript -e 'set the clipboard to (read (POSIX file "${imgPath}") as JPEG picture)'`;
			break;
		}
		case 'win32': {
			SCRIPT = `nircmd clipboard copyimage ${imgPath}`;
			break;
		}
		default: {
			SCRIPT = `xclip -selection clipboard -t image/png -i ${imgPath}`;
		}
	}

	// Running `await execa` leads to `Listr` not resolving the last task on Linux
	// Hence, we need to distinguish between OS’s and run it with or without `await`
	// This solution is not insanely beautiful, but makes it work cross-OS ¯\_(ツ)_/¯
	if (OS === 'darwin' || OS === 'win32') {
		await execa(SCRIPT, [], {
			shell: true,
		});
	} else {
		execa(SCRIPT, [], {
			shell: true,
		});
	}
};
