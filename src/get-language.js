// Packages
const fileExtension = require('file-extension');
const languageMap = require('./helpers/language-map.json');

const extensionsMapper = new Map([
	...languageMap,
	// Carbon Syntaxes that default to `auto`: Django, Bash, Octave
	// And (of course) everything else that isn’t even an option on Carbon :)
]);

module.exports = (file) => {
	const extension = fileExtension(file, {
		preserveCase: true, // My tests made me realize I missed this 🎉
	});

	return extensionsMapper.has(extension)
		? extensionsMapper.get(extension)
		: 'auto';
};
