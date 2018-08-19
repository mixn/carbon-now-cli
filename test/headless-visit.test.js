// Packages
import test from 'ava';
import globby from 'globby';
import del from 'del';

// Source
import headlessVisit from '../src/headless-visit';

const DEFAULT_DOWNLOAD_NAME = 'carbon.png';
const DOWNLOAD_DIR = 'carbon';
const FULL_DOWNLOAD_PATH = `${DOWNLOAD_DIR}/${DEFAULT_DOWNLOAD_NAME}`;

test('Fails due to wrong URL/timeout/event', async t => {
	try {
		await headlessVisit('foobar');
		t.fail();
	} catch (error) {
		t.pass();
	}
});

test('Downloads code image correctly', async t => {
	try {
		// Glob for a potentially existing download
		const globbed = await globby([DEFAULT_DOWNLOAD_NAME]);

		// If a download exists, delete it
		// XO makes me check like this ¯\_(ツ)_/¯
		if (globbed.length > 0) {
			await del(globbed);
		}

		// Download image
		await headlessVisit('https://carbon.now.sh');

		// If it exists, pass
		t.true((await globby([DEFAULT_DOWNLOAD_NAME])).length > 0);
	} catch (error) {
		t.fail();
	}
});

test('Downloads code image correctly with `headless` set', async t => {
	try {
		const globbed = await globby([DEFAULT_DOWNLOAD_NAME]);

		if (globbed.length > 0) {
			await del(globbed);
		}

		// Download image
		await headlessVisit('https://carbon.now.sh', null, null, true);

		// If it exists, pass
		t.true((await globby([DEFAULT_DOWNLOAD_NAME])).length > 0);
	} catch (error) {
		t.fail();
	}
});

test('Respects download location', async t => {
	await headlessVisit('https://carbon.now.sh', DOWNLOAD_DIR);

	t.true((await globby([FULL_DOWNLOAD_PATH])).length > 0);
});

// Cleanup
test.after.always((async () => {
	await del([
		DEFAULT_DOWNLOAD_NAME,
		DOWNLOAD_DIR
	]);
}));
