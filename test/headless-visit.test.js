// Packages
import test from 'ava';
import globby from 'globby';
import del from 'del';
import fileExists from 'file-exists';

// Source
import headlessVisit from '../src/headless-visit';
import {CARBON_URL} from '../src/helpers/globals';

const DEFAULT_DOWNLOAD_NAME = 'carbon.png';
const DOWNLOAD_DIR = 'carbon';
const FULL_DOWNLOAD_PATH = `${DOWNLOAD_DIR}/${DEFAULT_DOWNLOAD_NAME}`;
const TIMEOUT = 5000;

test.serial('Fails due to wrong URL/timeout/event', async t => {
	try {
		await headlessVisit({
			url: 'foobar',
			timeout: TIMEOUT
		});
		t.fail();
	} catch (error) {
		t.pass();
	}
});

test.serial('Downloads code image correctly', async t => {
	try {
		// Download image
		await headlessVisit({
			url: CARBON_URL,
			timeout: TIMEOUT
		});

		// If it exists, pass
		t.true(await fileExists(DEFAULT_DOWNLOAD_NAME));
	} catch (error) {
		t.fail();
	}
});

test.serial('Respects download location', async t => {
	await headlessVisit({
		url: CARBON_URL,
		location: DOWNLOAD_DIR,
		timeout: TIMEOUT
	});

	t.true((await globby([FULL_DOWNLOAD_PATH])).length > 0);
});

// Cleanup
test.after.always((async () => {
	await del([
		DEFAULT_DOWNLOAD_NAME,
		DOWNLOAD_DIR
	]);
}));
