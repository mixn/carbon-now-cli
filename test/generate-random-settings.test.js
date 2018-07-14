// Packages
import test from 'ava';

// Source
import generateRandomSettings from '../src/generate-random-settings';
import carbonMap from '../src/helpers/carbon-map';

test('Generate unique random settings', t => {
	const randomSettingsOne = generateRandomSettings();
	const randomSettingsTwo = generateRandomSettings();
	t.notDeepEqual(randomSettingsOne, randomSettingsTwo);
});

test('Contains randomizable features', t => {
	const randomSettings = generateRandomSettings();
	t.truthy(randomSettings.wc);
	t.truthy(randomSettings.ln);
	Object.keys(carbonMap).forEach(featureKey =>
		t.truthy(randomSettings[featureKey])
	);
});
