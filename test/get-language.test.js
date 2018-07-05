// Packages
import test from 'ava';

// Source
import getLanguage from '../src/get-language';
import languageMap from '../src/helpers/language-map';

test('Handles languages correctly', t => {
	// Some manual ones ¯\_(ツ)_/¯
	t.is(getLanguage('.htaccess'), 'text/apache');
	t.is(getLanguage('foo.C'), 'text/x-c++src');
	t.is(getLanguage('foo.hello'), 'auto');
	t.is(getLanguage('123.hi.yaml'), 'yaml');
	t.is(getLanguage('foo.yml'), 'yaml');
	t.is(getLanguage('-whut-'), 'auto');
	t.is(getLanguage('index.html'), 'htmlmixed');
	t.is(getLanguage('main.r'), 'r');
	t.is(getLanguage('main.foo.rs'), 'rust');

	// All 😎
	for (const [extension, language] of languageMap) {
		t.is(getLanguage(`foo.${extension}`), language);
	}
});
