// Native
const {readFile} = require('fs');
const {promisify} = require('bluebird');

module.exports = file => promisify(readFile)(file, {
	encoding: 'utf8'
});
