// Native
const { readFile } = require('fs');
const { promisify } = require('util');

module.exports = (file) =>
	promisify(readFile)(file, {
		encoding: 'utf8',
	});
