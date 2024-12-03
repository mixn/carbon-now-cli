import { temporaryDirectory } from 'tempy';
import { homedir } from 'os';
import { basename, extname } from 'path';
import { nanoid } from 'nanoid';

export default class Download {
  private imgType!: CarbonCLIDownloadType;
  private flags!: CarbonCLIFlagsInterface;
  private readonly tempDirectory = temporaryDirectory();
  private readonly uniqueId = nanoid(10);

  constructor(public file?: string) {}

  private expandHomeDirectory(saveDirectory: string): string {
    if (saveDirectory.startsWith('~')) {
      return saveDirectory.replace('~', homedir());
    }
    return saveDirectory;
  }

  public set setImgType(imgType: CarbonCLIDownloadType) {
    this.imgType = imgType;
  }

  public set setFlags(flags: CarbonCLIFlagsInterface) {
    this.flags = flags;
  }

  public get getSaveDirectory(): string {
    return this.flags.toClipboard
      ? this.tempDirectory
      : this.expandHomeDirectory(this.flags.saveTo);
  }

  public get getOriginalFileName(): string {
    return this.file ? basename(this.file, extname(this.file)) : 'stdin';
  }

  public get getNewFileName(): string {
    return this.flags.saveAs || `${this.getOriginalFileName}-${this.uniqueId}`;
  }

  public get getDownloadedAsPath(): string {
    return `${this.getSaveDirectory}/carbon.${this.imgType}`;
  }

  public get getSavedAsPath(): string {
    return `${this.getSaveDirectory}/${this.getNewFileName}.${this.imgType}`;
  }

  public get getPath(): string {
    return this.flags.toClipboard
      ? this.getDownloadedAsPath
      : this.getSavedAsPath;
  }
}
