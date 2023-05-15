import fileExtension from 'file-extension';
import { EOL } from 'os';
import { rename } from 'node:fs/promises';
import extensionsMap from '../helpers/cli/extensions-map.helper.js';

export default class FileHandler {
  private readonly extensions = extensionsMap;

  constructor(public file?: string) {}

  public async process(
    input: string,
    startLine = 0,
    endLine = 1000
  ): Promise<string> {
    return new Promise((resolve, reject) => {
      if (startLine > endLine) {
        return reject(new Error('Nonsensical line numbers.'));
      }
      resolve(
        input
          .split(EOL)
          .filter((_, index) => {
            const currentLine: number = index + 1;
            return currentLine >= startLine && currentLine <= endLine;
          })
          .join(EOL)
      );
    });
  }

  public async rename(from: string, to: string): Promise<void> {
    await rename(from, to);
  }

  public get getMimeType(): string {
    const extension = fileExtension(this.file, {
      preserveCase: true,
    });
    return this.extensions.get(extension) ?? 'auto';
  }
}
