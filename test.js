// Packages
import test from 'ava';
import execa from 'execa';

test('Should fail without at least one argument', async t => {
	try {
		await execa.stdout('./cli.js');
	} catch (error) {
		t.is(error.failed, true);
	}
});
