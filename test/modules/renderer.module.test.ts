import { chromium, Browser, Page, Download } from '@playwright/test';
import RendererModule from '../../src/modules/renderer.module.js';
import { CARBON_URL } from '../../src/helpers/carbon/constants.helper.js';
import { DUMMY_LOCATION } from '../helpers/constants.helper.js';

const EXPORT_MENU_SELECTOR = '#export-menu';
const EXPORT_PNG_SELECTOR = '#export-png';

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
			}),
			close: jest.fn(),
		}),
	},
}));

describe('RendererModule', () => {
	it('should throw if an invalid type is provided', async () => {
		await expect(
			RendererModule.create(CARBON_URL, 'invalid' as any)
		).rejects.toThrow('Invalid type. Only png and svg are supported.');
	});

	it('should spawn browser & open a new page correctly', async () => {
		const Renderer = await RendererModule.create(
			CARBON_URL,
			'png',
			DUMMY_LOCATION,
			false
		);
		await Renderer.download();
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
		const Renderer = await RendererModule.create(
			CARBON_URL,
			'png',
			DUMMY_LOCATION
		);
		await Renderer.download();
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
		const Renderer = await RendererModule.create(
			CARBON_URL,
			'svg',
			DUMMY_LOCATION
		);
		await Renderer.download();
		const Page = await (await chromium.launch()).newPage();
		expect(Page.waitForEvent).toHaveBeenCalledWith('download');
		expect(
			await (
				await Page.waitForEvent('download')
			).saveAs
		).toHaveBeenCalledWith(`${DUMMY_LOCATION}/carbon.svg`);
	});

	it('should throw if an error occurs during the download', async () => {
		const Renderer = await RendererModule.create(
			CARBON_URL,
			'png',
			DUMMY_LOCATION
		);
		const Page = await (await chromium.launch()).newPage();
		const error = new Error('An error occurred during the download.');
		Page.waitForEvent = jest.fn().mockRejectedValueOnce(error);
		await expect(Renderer.download()).rejects.toThrow(error.message);
	});
});
