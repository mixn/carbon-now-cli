const carbonMap = require('./helpers/carbon-map.json');

module.exports = () => {
	const randomSettings = {};
	// Features t, wt, fm, es
	for (const featureName in carbonMap) {
		if (Object.prototype.hasOwnProperty.call(carbonMap, featureName)) {
			const featureMap = carbonMap[featureName];
			const keys = Object.keys(featureMap);
			const randomIndex = Math.floor(Math.random() * keys.length);
			const randomKey = keys[randomIndex];
			randomSettings[featureName] = featureMap[randomKey];
		}
	}
	// Features wc, ln
	randomSettings.wc = Math.random() >= 0.5;
	randomSettings.ln = Math.random() >= 0.5;
	return randomSettings;
};
