import tempy from 'tempy';
import mockOS from 'mock-os';
import { nanoid } from 'nanoid';
import DownloadModule from '../../src/modules/download.module.js';
import {
  DUMMY_FILE,
  DUMMY_TARGET,
  DUMMY_LOCATION,
  DUMMY_LOCATION_EXPANDED,
  DUMMY_TEMP_FOLDER,
  DUMMY_DEFAULT_FILE_NAME,
} from '../helpers/constants.helper.js';

jest.mock('nanoid');
jest.mock('tempy');

beforeEach(() => {
  (tempy as jest.Mocked<typeof tempy>).directory.mockReturnValue(
    DUMMY_TEMP_FOLDER
  );
  (nanoid as jest.MockedFunction<typeof nanoid>).mockReturnValue('123456789');
});

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
      target: DUMMY_TARGET,
    } as CarbonCLIFlagsInterface;
    expect(Download.getNewFileName).toBe(DUMMY_TARGET);
    const Download2 = new DownloadModule(DUMMY_FILE);
    Download2.setFlags = {
      target: undefined,
    } as CarbonCLIFlagsInterface;
    expect(Download2.getNewFileName).toBe('_unfold-123456789');
  });

  it('should return the save directory correctly', () => {
    const Download = new DownloadModule();
    Download.setFlags = {
      copy: false,
      location: DUMMY_LOCATION,
    } as CarbonCLIFlagsInterface;
    expect(Download.getSaveDirectory).toBe(DUMMY_LOCATION_EXPANDED);
    Download.setFlags = {
      copy: true,
      location: DUMMY_LOCATION,
    } as CarbonCLIFlagsInterface;
    expect(Download.getSaveDirectory).toBe(DUMMY_TEMP_FOLDER);
  });

  it('should return the full download path correctly', () => {
    const Download = new DownloadModule();
    Download.setImgType = 'png';
    Download.setFlags = {
      copy: false,
      location: DUMMY_LOCATION,
    } as CarbonCLIFlagsInterface;
    expect(Download.getDownloadedAsPath).toBe(
      `${DUMMY_LOCATION_EXPANDED}/${DUMMY_DEFAULT_FILE_NAME}`
    );
    Download.setImgType = 'png';
    Download.setFlags = {
      copy: true,
      location: DUMMY_LOCATION,
    } as CarbonCLIFlagsInterface;
    expect(Download.getDownloadedAsPath).toBe(
      `${DUMMY_TEMP_FOLDER}/${DUMMY_DEFAULT_FILE_NAME}`
    );
  });

  it('should return the full saved-to path correctly', () => {
    const Download = new DownloadModule();
    Download.setImgType = 'png';
    Download.setFlags = {
      copy: false,
      target: DUMMY_TARGET,
      location: DUMMY_LOCATION,
    } as CarbonCLIFlagsInterface;
    expect(Download.getSavedAsPath).toBe(
      `${DUMMY_LOCATION_EXPANDED}/${DUMMY_TARGET}.png`
    );
    Download.setFlags = {
      copy: true,
      target: DUMMY_TARGET,
      location: DUMMY_LOCATION,
    } as CarbonCLIFlagsInterface;
    expect(Download.getSavedAsPath).toBe(
      `${DUMMY_TEMP_FOLDER}/${DUMMY_TARGET}.png`
    );
  });

  it('should return the full, final path correctly', () => {
    const Download = new DownloadModule();
    Download.setImgType = 'png';
    Download.setFlags = {
      copy: false,
      target: DUMMY_TARGET,
      location: DUMMY_LOCATION,
    } as CarbonCLIFlagsInterface;
    expect(Download.getPath).toBe(
      `${DUMMY_LOCATION_EXPANDED}/${DUMMY_TARGET}.png`
    );
    Download.setFlags = {
      copy: true,
      target: DUMMY_TARGET,
      location: DUMMY_LOCATION,
    } as CarbonCLIFlagsInterface;
    expect(Download.getPath).toBe(
      `${DUMMY_TEMP_FOLDER}/${DUMMY_DEFAULT_FILE_NAME}`
    );
    Download.setFlags = {
      copy: false,
      target: undefined,
      location: DUMMY_LOCATION,
    } as CarbonCLIFlagsInterface;
    expect(Download.getPath).toBe(
      `${DUMMY_LOCATION_EXPANDED}/stdin-123456789.png`
    );
    const Download2 = new DownloadModule(DUMMY_FILE);
    Download2.setImgType = 'svg';
    Download2.setFlags = {
      copy: false,
      target: undefined,
      location: DUMMY_LOCATION,
    } as CarbonCLIFlagsInterface;
    expect(Download2.getPath).toBe(
      `${DUMMY_LOCATION_EXPANDED}/_unfold-123456789.svg`
    );
  });

  it('should not expand a location if it doesn’t start with `~`', () => {
    const Download = new DownloadModule();
    Download.setImgType = 'png';
    Download.setFlags = {
      copy: false,
      target: DUMMY_TARGET,
      location: './relative',
    } as CarbonCLIFlagsInterface;
    expect(Download.getPath).toBe(`./relative/${DUMMY_TARGET}.png`);
  });
});
