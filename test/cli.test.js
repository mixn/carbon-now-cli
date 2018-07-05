// Packages
import test from 'ava';
import execa from 'execa';

test('Running `carbon-now-sh` fails without at least one argument', async t => {
	try {
		await execa.stdout('./cli.js');
	} catch (error) {
		t.is(error.failed, true);
	}
});
