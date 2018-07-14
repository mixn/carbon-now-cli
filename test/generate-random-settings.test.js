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
	// Manual boolean checks
	t.not(randomSettings.wc, undefined);
	t.not(randomSettings.ln, undefined);
	// Automatic checks
	Object.keys(carbonMap).forEach(featureKey =>
		t.truthy(randomSettings[featureKey])
	);
});
