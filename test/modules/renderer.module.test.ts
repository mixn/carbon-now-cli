/**
 * @jest-environment jsdom
 */
import { chromium, Browser, Page, Download } from '@playwright/test';
import RendererModule from '../../src/modules/renderer.module.js';
import {
  CARBON_URL,
  CARBON_CUSTOM_THEME,
  CARBON_LOCAL_STORAGE_KEY,
} from '../../src/helpers/carbon/constants.helper.js';
import { DUMMY_LOCATION } from '../helpers/constants.helper.js';

const EXPORT_MENU_SELECTOR = '#export-menu';
const EXPORT_PNG_SELECTOR = '#export-png';
const TYPE_PNG: CarbonCLIDownloadType = 'png';
const TYPE_SVG: CarbonCLIDownloadType = 'svg';

jest.mock('@playwright/test', () => ({
  chromium: {
    launch: jest.fn().mockReturnValue({
      newPage: jest.fn().mockReturnValue({
        goto: jest.fn(),
        waitForSelector: jest.fn().mockReturnValue({
          click: jest.fn(),
        }),
        $: jest.fn().mockReturnValue({ click: jest.fn() }),
        waitForEvent: jest.fn().mockReturnValue({
          saveAs: jest.fn(),
        }),
        addInitScript: jest.fn().mockImplementation((callback, args) => {
          callback(args);
        }),
      }),
      close: jest.fn(),
    }),
  },
}));

describe('RendererModule', () => {
  it('should throw if an invalid type is provided', async () => {
    await expect(RendererModule.create('invalid' as any)).rejects.toThrow(
      'Invalid type. Only png and svg are supported.'
    );
  });

  it('should spawn browser & open a new page correctly', async () => {
    const Renderer = await RendererModule.create(TYPE_PNG, false);
    await Renderer.download(CARBON_URL, DUMMY_LOCATION);
    expect(chromium.launch).toHaveBeenCalledWith({
      headless: false,
    });
    expect(await (await chromium.launch()).newPage).toHaveBeenCalledWith({
      viewport: {
        width: 1800,
        height: 1000,
      },
      deviceScaleFactor: 2,
    });
  });

  it('should navigate to download initialization correctly', async () => {
    const Renderer = await RendererModule.create(TYPE_PNG);
    await Renderer.download(CARBON_URL, DUMMY_LOCATION);
    const Page = await (await chromium.launch()).newPage();
    expect(await Page.goto).toHaveBeenCalledWith(CARBON_URL);
    expect(await Page.waitForSelector).toHaveBeenCalledWith(
      EXPORT_MENU_SELECTOR
    );
    expect(
      await (
        await Page.waitForSelector(EXPORT_MENU_SELECTOR)
      )?.click
    ).toHaveBeenCalled();
    expect(await Page.$).toHaveBeenCalledWith(EXPORT_PNG_SELECTOR);
    expect(
      await (
        await Page.$(EXPORT_MENU_SELECTOR)
      )?.click
    ).toHaveBeenCalled();
  });

  it('should download Carbon image correctly', async () => {
    const Renderer = await RendererModule.create(TYPE_SVG);
    await Renderer.download(CARBON_URL, DUMMY_LOCATION);
    const Page = await (await chromium.launch()).newPage();
    expect(Page.waitForEvent).toHaveBeenCalledWith('download');
    expect(
      await (
        await Page.waitForEvent('download')
      ).saveAs
    ).toHaveBeenCalledWith(`${DUMMY_LOCATION}/carbon.svg`);
  });

  it('should throw if an error occurs during the download', async () => {
    const Renderer = await RendererModule.create(TYPE_PNG);
    const Page = await (await chromium.launch()).newPage();
    const error = new Error('An error occurred during the download.');
    Page.waitForEvent = jest.fn().mockRejectedValueOnce(error);
    await expect(Renderer.download(CARBON_URL, DUMMY_LOCATION)).rejects.toThrow(
      error.message
    );
  });

  it('should accept custom themes correctly', async () => {
    const Renderer = await RendererModule.create(TYPE_PNG);
    await Renderer.setCustomTheme({});
    await Renderer.download(CARBON_URL, DUMMY_LOCATION);
    const Page = await (await chromium.launch()).newPage();
    expect(Page.addInitScript).toHaveBeenCalledTimes(1);
    expect(Page.addInitScript).toHaveBeenCalledWith(expect.any(Function), {
      highlights: {},
      theme: CARBON_CUSTOM_THEME,
      CARBON_LOCAL_STORAGE_KEY,
    });
    expect(window.localStorage.getItem(CARBON_LOCAL_STORAGE_KEY)).toEqual(
      JSON.stringify([
        {
          id: CARBON_CUSTOM_THEME,
          name: CARBON_CUSTOM_THEME,
          highlights: {},
          custom: true,
        },
      ])
    );
  });
});
