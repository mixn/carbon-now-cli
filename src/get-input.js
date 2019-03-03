// Native
const {promisify} = require('util');
const readFileAsync = promisify(require('fs').readFile);

// Dependencies
const getStdin = require('get-stdin');
const clipboardy = require('clipboardy');

module.exports = (FILE, FROM_CLIPBOARD) => {
	return new Promise(async (resolve, reject) => {
		if (FILE) {
			resolve(await readFileAsync(FILE, 'utf8'));
		} else if (FROM_CLIPBOARD) {
			resolve(clipboardy.readSync());
		}	else {
			const STDIN = await getStdin();

			if (STDIN) {
				resolve(STDIN);
			} else {
				reject(new Error('No file or stdin given'));
			}
		}
	});
};
