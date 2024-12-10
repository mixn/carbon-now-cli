import mockOS from 'mock-os';
import DownloadModule from '../../src/modules/download.module.js';
import {
  DUMMY_FILE,
  DUMMY_TARGET,
  DUMMY_LOCATION,
  DUMMY_LOCATION_EXPANDED,
  DUMMY_TEMP_FOLDER,
  DUMMY_DEFAULT_FILE_NAME,
} from '../helpers/constants.helper.js';

vi.mock('nanoid', () => ({
  nanoid: vi.fn(() => '123456789'),
}));
vi.mock('tempy', () => ({
  temporaryDirectory: vi.fn(() => DUMMY_TEMP_FOLDER),
}));

beforeAll(() => {
  mockOS({
    homedir: '/Users/mixn',
  });
});

afterAll(() => {
  mockOS.restore();
});

describe('DownloadModule', () => {
  it('should return the original file name correctly', () => {
    const Download = new DownloadModule(DUMMY_FILE);
    expect(Download.getOriginalFileName).toBe('_unfold');
    const Download2 = new DownloadModule();
    expect(Download2.getOriginalFileName).toBe('stdin');
  });

  it('should return the new file name correctly', () => {
    const Download = new DownloadModule();
    Download.setFlags = {
      saveAs: DUMMY_TARGET,
    } as CarbonCLIFlagsInterface;
    expect(Download.getNewFileName).toBe(DUMMY_TARGET);
    const Download2 = new DownloadModule(DUMMY_FILE);
    Download2.setFlags = {
      saveAs: undefined,
    } as CarbonCLIFlagsInterface;
    expect(Download2.getNewFileName).toBe('_unfold-123456789');
  });

  it('should return the downloaded as file name correctly', () => {
    const Download = new DownloadModule(DUMMY_FILE);
    Download.setFlags = {
      saveAs: undefined,
    } as CarbonCLIFlagsInterface;
    expect(Download.getDownloadedAsFileName).toBe('carbon-123456789');
  });

  it('should return the save directory correctly', () => {
    const Download = new DownloadModule();
    Download.setFlags = {
      toClipboard: false,
      saveTo: DUMMY_LOCATION,
    } as CarbonCLIFlagsInterface;
    expect(Download.getSaveDirectory).toBe(DUMMY_LOCATION_EXPANDED);
    Download.setFlags = {
      toClipboard: true,
      saveTo: DUMMY_LOCATION,
    } as CarbonCLIFlagsInterface;
    expect(Download.getSaveDirectory).toBe(DUMMY_TEMP_FOLDER);
  });

  it('should return the full download path correctly', () => {
    const Download = new DownloadModule();
    Download.setImgType = 'png';
    Download.setFlags = {
      toClipboard: false,
      saveTo: DUMMY_LOCATION,
    } as CarbonCLIFlagsInterface;
    expect(Download.getDownloadedAsPath).toBe(
      `${DUMMY_LOCATION_EXPANDED}/${DUMMY_DEFAULT_FILE_NAME}`,
    );
    Download.setImgType = 'png';
    Download.setFlags = {
      toClipboard: true,
      saveTo: DUMMY_LOCATION,
    } as CarbonCLIFlagsInterface;
    expect(Download.getDownloadedAsPath).toBe(
      `${DUMMY_TEMP_FOLDER}/${DUMMY_DEFAULT_FILE_NAME}`,
    );
  });

  it('should return the full saved-to path correctly', () => {
    const Download = new DownloadModule();
    Download.setImgType = 'png';
    Download.setFlags = {
      toClipboard: false,
      saveAs: DUMMY_TARGET,
      saveTo: DUMMY_LOCATION,
    } as CarbonCLIFlagsInterface;
    expect(Download.getSavedAsPath).toBe(
      `${DUMMY_LOCATION_EXPANDED}/${DUMMY_TARGET}.png`,
    );
    Download.setFlags = {
      toClipboard: true,
      saveAs: DUMMY_TARGET,
      saveTo: DUMMY_LOCATION,
    } as CarbonCLIFlagsInterface;
    expect(Download.getSavedAsPath).toBe(
      `${DUMMY_TEMP_FOLDER}/${DUMMY_TARGET}.png`,
    );
  });

  it('should return the full, final path correctly', () => {
    const Download = new DownloadModule();
    Download.setImgType = 'png';
    Download.setFlags = {
      toClipboard: false,
      saveAs: DUMMY_TARGET,
      saveTo: DUMMY_LOCATION,
    } as CarbonCLIFlagsInterface;
    expect(Download.getPath).toBe(
      `${DUMMY_LOCATION_EXPANDED}/${DUMMY_TARGET}.png`,
    );
    Download.setFlags = {
      toClipboard: true,
      saveAs: DUMMY_TARGET,
      saveTo: DUMMY_LOCATION,
    } as CarbonCLIFlagsInterface;
    expect(Download.getPath).toBe(
      `${DUMMY_TEMP_FOLDER}/${DUMMY_DEFAULT_FILE_NAME}`,
    );
    Download.setFlags = {
      toClipboard: false,
      saveAs: undefined,
      saveTo: DUMMY_LOCATION,
    } as CarbonCLIFlagsInterface;
    expect(Download.getPath).toBe(
      `${DUMMY_LOCATION_EXPANDED}/stdin-123456789.png`,
    );
    const Download2 = new DownloadModule(DUMMY_FILE);
    Download2.setImgType = 'svg';
    Download2.setFlags = {
      toClipboard: false,
      saveAs: undefined,
      saveTo: DUMMY_LOCATION,
    } as CarbonCLIFlagsInterface;
    expect(Download2.getPath).toBe(
      `${DUMMY_LOCATION_EXPANDED}/_unfold-123456789.svg`,
    );
  });

  it('should not expand a location if it doesn’t start with `~`', () => {
    const Download = new DownloadModule();
    Download.setImgType = 'png';
    Download.setFlags = {
      toClipboard: false,
      saveAs: DUMMY_TARGET,
      saveTo: './relative',
    } as CarbonCLIFlagsInterface;
    expect(Download.getPath).toBe(`./relative/${DUMMY_TARGET}.png`);
  });
});
