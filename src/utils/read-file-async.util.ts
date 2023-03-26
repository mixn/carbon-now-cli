import { readFile } from 'node:fs/promises';

export default async (FILE: string) =>
	await readFile(FILE, { encoding: 'utf8' });
