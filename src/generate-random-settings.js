const carbonMap = require('./helpers/carbon-map.json');

module.exports = () => {
	const randomSettings = {};

	for (const featureName in carbonMap) {
		if (Object.prototype.hasOwnProperty.call(carbonMap, featureName)) {
			const keys = Object.keys(carbonMap[featureName]);
			const length = keys.length;
			const randomIndex = Math.floor(Math.random() * length);
			const randomKey = keys[randomIndex];

			randomSettings[featureName] = randomKey;
		}
	}

	return randomSettings;
};
