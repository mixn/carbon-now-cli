import tempy from 'tempy';
import { homedir } from 'os';
import { basename, extname } from 'path';
import { nanoid } from 'nanoid';

export default class Download {
	private imgType!: CarbonCLIDownloadType;
	private flags!: CarbonCLIFlagsInterface;
	private readonly tempDirectory = tempy.directory();
	private readonly uniqueId = nanoid(10);

	constructor(public file?: string) {}

	private expandHomeDirectory(location: string): string {
		if (location.startsWith('~')) {
			return location.replace('~', homedir());
		}
		return location;
	}

	public set setImgType(imgType: CarbonCLIDownloadType) {
		this.imgType = imgType;
	}

	public set setFlags(flags: CarbonCLIFlagsInterface) {
		this.flags = flags;
	}

	public get getSaveDirectory(): string {
		return this.flags.copy
			? this.tempDirectory
			: this.expandHomeDirectory(this.flags.location);
	}

	public get getOriginalFileName(): string {
		return this.file ? basename(this.file, extname(this.file)) : 'stdin';
	}

	public get getNewFileName(): string {
		return this.flags.target || `${this.getOriginalFileName}-${this.uniqueId}`;
	}

	public get getDownloadedAsPath(): string {
		return `${this.getSaveDirectory}/carbon.${this.imgType}`;
	}

	public get getSavedAsPath(): string {
		return `${this.getSaveDirectory}/${this.getNewFileName}.${this.imgType}`;
	}

	public get getPath(): string {
		return this.flags.copy ? this.getDownloadedAsPath : this.getSavedAsPath;
	}
}
