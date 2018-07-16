// Packages
import test from 'ava';
import globby from 'globby';
import del from 'del';

// Source
import headlessVisit from '../src/headless-visit';

const defaultDownloadName = 'carbon.png';
const downloadDir = 'carbon';
const fullDownloadPath = `${downloadDir}/${defaultDownloadName}`;

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
		const globbed = await globby([defaultDownloadName]);

		// If a download exists, delete it
		// XO makes me check like this ¯\_(ツ)_/¯
		if (globbed.length > 0) {
			await del(globbed);
		}

		// Download image
		await headlessVisit('https://carbon.now.sh', process.cwd(), {}, true);

		// If it exists, pass
		t.true((await globby([defaultDownloadName])).length > 0);
	} catch (error) {
		t.fail();
	}
});

test('Respects download location', async t => {
	await headlessVisit('https://carbon.now.sh', downloadDir, {}, true);

	t.true((await globby([fullDownloadPath])).length > 0);
});

// Cleanup
test.after.always((async () => {
	await del([
		defaultDownloadName,
		downloadDir
	]);
}));
