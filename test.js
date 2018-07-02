import test from 'ava';
import execa from 'execa';

test('title', async t => {
	t.is(await execa.stdout('./cli.js', ['ponies']), 'ponies & rainbows');
});
