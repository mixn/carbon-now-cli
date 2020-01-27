// Native
const {readFile} = require('fs');

// Dependencies
const getStdin = require('get-stdin');
const clipboardy = require('clipboardy');
const {promisify} = require('bluebird');
const readFileAsync = promisify(readFile);

module.exports = (FILE, FROM_CLIPBOARD) => {
	return new Promise((resolve, reject) => {
		if (FILE) {
			resolve(readFileAsync(FILE, 'utf8'));
		} else if (FROM_CLIPBOARD) {
			resolve(clipboardy.readSync());
		} else {
			getStdin()
				.then(data => {
					if (!data) {
						return reject(new Error('No file or stdin given.'));
					}

					resolve(data);
				})
				.catch(e => {
					reject(e);
				});
		}
	});
};
