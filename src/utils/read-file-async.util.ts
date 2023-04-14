import { readFile } from 'node:fs/promises';

export default async (
	FILE: string,
	shouldEncode: boolean = true
): Promise<Buffer | string> =>
	await readFile(FILE, { encoding: shouldEncode ? 'utf8' : null });
