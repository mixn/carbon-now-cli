import { readFile } from 'node:fs/promises';

export default async (
	file: string,
	shouldEncode: boolean = true
): Promise<Buffer | string> =>
	await readFile(file, { encoding: shouldEncode ? 'utf8' : null });
