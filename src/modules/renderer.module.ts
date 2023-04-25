import { chromium, Browser, Page } from '@playwright/test';

export default class Renderer {
  private url!: string;
  private type!: CarbonCLIDownloadType;
  private saveDirectory!: string;
  private headless!: boolean;
  private browser!: Browser;
  private page!: Page;
  private readonly pageOptions = {
    viewport: {
      width: 1800,
      height: 1000,
    },
    deviceScaleFactor: 2,
  };

  static async create(
    url: string,
    type: CarbonCLIDownloadType = 'png',
    saveDirectory: string = process.cwd(),
    headless: boolean = true
  ): Promise<Renderer> {
    if (!['png', 'svg'].includes(type)) {
      throw new Error('Invalid type. Only png and svg are supported.');
    }
    const RendererInstance = new this();
    RendererInstance.url = url;
    RendererInstance.type = type;
    RendererInstance.saveDirectory = saveDirectory;
    await RendererInstance.init(headless);
    return RendererInstance;
  }

  private async init(isHeadless: boolean): Promise<void> {
    this.browser = await chromium.launch({
      headless: isHeadless,
    });
    this.page = await this.browser.newPage(this.pageOptions);
  }

  private async navigate(): Promise<void> {
    await this.page.goto(this.url);
    const ExportMenuElement = await this.page.waitForSelector('#export-menu');
    await ExportMenuElement?.click();
    const ExportTriggerElement = await this.page.$(`#export-${this.type}`);
    await ExportTriggerElement?.click();
  }

  public async download(): Promise<void> {
    try {
      const queuedDownloadEvent = this.page.waitForEvent('download');
      await this.navigate();
      const download = await queuedDownloadEvent;
      await download?.saveAs(`${this.saveDirectory}/carbon.${this.type}`);
    } catch (e) {
      throw new Error((e as Error).message);
    } finally {
      await this.browser.close();
    }
  }
}
