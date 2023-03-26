import clipboard from 'clipboardy';
import getStdin from 'get-stdin';
import readFileAsync from './read-file-async.util.js';

export default (FILE: string | undefined, FROM_CLIPBOARD?: boolean) =>
	new Promise(async (resolve, reject) => {
		let STDIN;

		if (FILE) {
			return resolve(await readFileAsync(FILE));
		}
		if (FROM_CLIPBOARD) {
			return resolve(clipboard.readSync());
		}
		if ((STDIN = await getStdin())) {
			return resolve(STDIN);
		}

		return reject('No file or stdin given.');
	});
