// Native
const fs = require('fs');
const readline = require('readline');

module.exports = (file, start = 0, end = 1000) => {
	return new Promise((resolve, reject) => {
		// Reject immediately when nonsensical input
		if (start > end) {
			reject();
		}

		const lines = [];
		const rlStream = readline.createInterface({
			input: fs.createReadStream(file)
		});
		let currentLine = 1;

		rlStream.on('line', line => {
			if (currentLine >= start && currentLine <= end) {
				lines.push(line);
			}
			currentLine++;
		});

		rlStream.on('close', () => {
			resolve(lines.join('\n'));
		});
	});
};
