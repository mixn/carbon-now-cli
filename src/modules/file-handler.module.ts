import fileExtension from 'file-extension';
import extensionsMap from '../helpers/cli/extensions-map.helper.json';

class FileHandler {
	private extensions = new Map([...(extensionsMap as [])]);

	constructor(public file?: string) {}

	public async process(
		fileContent: string,
		startLine = 0,
		endLine = 1000
	): Promise<string> {
		const NEW_LINE = '\n';
		return new Promise((resolve, reject) => {
			if (startLine > endLine) {
				return reject('Nonsensical line numbers.');
			}
			resolve(
				fileContent
					.split(NEW_LINE)
					.filter((_, index) => {
						const currentLine: number = index + 1;
						return currentLine >= startLine && currentLine <= endLine;
					})
					.join(NEW_LINE)
			);
		});
	}

	public get getMimeType() {
		const extension = fileExtension(this.file, {
			preserveCase: true,
		});
		return this.extensions.has(extension)
			? this.extensions.get(extension)
			: 'auto';
	}
}

export default FileHandler;
