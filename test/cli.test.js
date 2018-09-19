// Packages
import test from 'ava';
import execa from 'execa';
import fileExists from 'file-exists';
import del from 'del';

const DUMMY_TARGET = 'custom-file-name';
const DUMMY_FILE = `${DUMMY_TARGET}.png`;

test.serial('Running `carbon-now` fails without at least one argument', async t => {
	try {
		await execa.stdout('./cli.js');
		t.fail();
	} catch (error) {
		t.true(error.failed);
	}
});

test.serial('Allows for custom file name via --target', async t => {
	await execa('./cli.js', [
		'./test/test-dummies/_unfold.js',
		`-t=${DUMMY_TARGET}`
	]);

	t.true(await fileExists(DUMMY_FILE));
});

// Cleanup
test.after.always((async () => {
	await del([
		DUMMY_FILE
	]);
}));
