import tempy from 'tempy';
import { basename, extname } from 'path';
import { nanoid } from 'nanoid';

export default class Download {
	private imgType!: CarbonCLIDownloadType;
	private flags!: CarbonCLIFlagsInterface;
	private readonly tempDirectory = tempy.directory();
	private readonly uniqueId = nanoid(10);

	constructor(public file?: string) {}

	public set setImgType(imgType: CarbonCLIDownloadType) {
		this.imgType = imgType;
	}

	public set setFlags(flags: CarbonCLIFlagsInterface) {
		this.flags = flags;
	}

	public get getSaveDirectory() {
		return this.flags.copy ? this.tempDirectory : this.flags.location;
	}

	public get getOriginalFileName() {
		return this.file ? basename(this.file, extname(this.file)) : 'stdin';
	}

	public get getNewFileName() {
		return this.flags.target || `${this.getOriginalFileName}-${this.uniqueId}`;
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
