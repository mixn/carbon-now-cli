import tempy from 'tempy';
import fileExtension from 'file-extension';
import { EOL } from 'os';
import { basename, extname } from 'path';
import { nanoid } from 'nanoid';
import extensionsMap from '../helpers/cli/extensions-map.helper.js';

class FileHandler {
	private imgType!: CarbonCLIPresetInterface['type'];
	private flags!: CarbonCLIFlagsInterface;
	// TODO: Type better
	private extensions = new Map<string, string>([
		...(extensionsMap as [[string, string]]),
	]);

	constructor(public file?: string) {}

	public async process(
		fileContent: string,
		startLine = 0,
		endLine = 1000
	): Promise<string> {
		return new Promise((resolve, reject) => {
			if (startLine > endLine) {
				return reject('Nonsensical line numbers.');
			}
			resolve(
				fileContent
					.split(EOL)
					.filter((_, index) => {
						const currentLine: number = index + 1;
						return currentLine >= startLine && currentLine <= endLine;
					})
					.join(EOL)
			);
		});
	}

	public set setImgType(imgType: CarbonCLIPresetInterface['type']) {
		this.imgType = imgType;
	}

	public set setFlags(flags: CarbonCLIFlagsInterface) {
		this.flags = flags;
	}

	public get getMimeType() {
		const extension = fileExtension(this.file, {
			preserveCase: true,
		});
		return this.extensions.has(extension)
			? this.extensions.get(extension)
			: 'auto';
	}

	public get getSaveDirectory() {
		return this.flags.copy ? tempy.directory() : this.flags.location;
	}

	public get getOriginalFileName() {
		return this.file ? basename(this.file, extname(this.file)) : 'stdin';
	}

	public get getNewFileName() {
		return this.flags.target || `${this.getOriginalFileName}-${nanoid(10)}`;
	}

	public get getDownloadedAsPath() {
		return `${this.getSaveDirectory}/carbon.${this.imgType}`;
	}

	public get getSavedAsPath() {
		return `${this.getSaveDirectory}/${this.getNewFileName}.${this.imgType}`;
	}

	public get getPath() {
		return this.flags.copy ? this.getDownloadedAsPath : this.getSavedAsPath;
	}
}

export default FileHandler;
