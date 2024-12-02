import {
  chromium,
  firefox,
  webkit,
  Browser,
  Page,
  BrowserType,
} from '@playwright/test';
import {
  CARBON_CUSTOM_THEME,
  CARBON_LOCAL_STORAGE_KEY,
} from '../../src/helpers/carbon/constants.helper.js';

// TODO: Fix non-identified global
enum CarbonCLIEngineFlagEnum {
  chromium = 'chromium',
  firefox = 'firefox',
  webkit = 'webkit',
}

export default class Renderer {
  private type!: CarbonCLIDownloadType;
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
    engineType: CarbonCLIEngineFlagEnum = CarbonCLIEngineFlagEnum.chromium,
    disableHeadless: boolean = false,
    type: CarbonCLIDownloadType = 'png'
  ): Promise<Renderer> {
    if (!['png', 'svg'].includes(type)) {
      throw new Error('Invalid type. Only png and svg are supported.');
    }
    const RendererInstance = new this();
    RendererInstance.type = type;
    await RendererInstance.init(engineType, disableHeadless);
    return RendererInstance;
  }

  private getEngine(engine: CarbonCLIEngineFlagEnum): BrowserType {
    switch (engine) {
      case CarbonCLIEngineFlagEnum.chromium: {
        return chromium;
      }
      case CarbonCLIEngineFlagEnum.firefox: {
        return firefox;
      }
      case CarbonCLIEngineFlagEnum.webkit: {
        return webkit;
      }
      default: {
        return chromium;
      }
    }
  }

  private async init(
    engineType: CarbonCLIEngineFlagEnum,
    hasHeadlessDisabled: boolean
  ): Promise<void> {
    this.browser = await this.getEngine(engineType).launch({
      headless: !hasHeadlessDisabled,
    });
    this.page = await this.browser.newPage(this.pageOptions);
  }

  private async navigate(url: string): Promise<void> {
    await this.page.goto(url);
    await (await this.page.waitForSelector('#export-menu'))?.click();
    await (await this.page.$(`#export-${this.type}`))?.click();
  }

  public async setCustomTheme(
    highlights: CarbonThemeHighlightsInterface,
    theme: CarbonCustomThemeNameType = CARBON_CUSTOM_THEME
  ): Promise<void> {
    await this.page.addInitScript(
      ({ highlights, theme, CARBON_LOCAL_STORAGE_KEY }) => {
        const themes: CarbonLocalStorageThemeInterface[] = [
          {
            id: theme,
            name: theme,
            highlights,
            custom: true,
          },
        ];
        window.localStorage.setItem(
          CARBON_LOCAL_STORAGE_KEY,
          JSON.stringify(themes)
        );
      },
      // Passing this in as the 2nd parameter is crucial, see:
      // https://github.com/microsoft/playwright/issues/6258#issuecomment-1030704374
      { highlights, theme, CARBON_LOCAL_STORAGE_KEY }
    );
  }

  public async download(
    url: string,
    saveDirectory: string = process.cwd()
  ): Promise<void> {
    try {
      const queuedDownloadEvent = this.page.waitForEvent('download');
      await this.navigate(url);
      await (
        await queuedDownloadEvent
      )?.saveAs(`${saveDirectory}/carbon.${this.type}`);
    } catch (e) {
      throw new Error((e as Error).message);
    } finally {
      await this.browser.close();
    }
  }
}
