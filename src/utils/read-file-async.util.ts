import { readFile } from 'node:fs/promises';

export default async (
	FILE: string,
	encoding: BufferEncoding | null = 'utf8'
): Promise<Buffer | string> => await readFile(FILE, { encoding });
