#!/usr/bin/env node
import open from 'open';
import updateNotifier from 'update-notifier';
import { Listr } from 'listr2';
import { stringify } from 'query-string';
import { clipboard } from 'clipboard-sys';

import PromptModule from './src/modules/prompt.module.js';
import PresetHandlerModule from './src/modules/preset-handler.module.js';
import FileHandlerModule from './src/modules/file-handler.module.js';
import DownloadModule from './src/modules/download.module.js';
import RendererModule from './src/modules/renderer.module.js';
import readFileAsync from './src/utils/read-file-async.util.js';
import transformToQueryParams from './src/utils/transform-to-query-params.util.js';
import defaultSettings from './src/config/cli/default-settings.config.js';
import defaultErrorView from './src/views/default-error.view.js';
import defaultSuccessView from './src/views/default-success.view.js';
import packageJson from './package.json' assert { type: 'json' };
import {
  CARBON_URL,
  CARBON_CUSTOM_THEME,
} from './src/helpers/carbon/constants.helper.js';

const Prompt = await PromptModule.create();
const file = Prompt.getFile;
const flags = Prompt.getFlags;
const input = Prompt.getInput;
const answers = Prompt.getAnswers;
const PresetHandler = new PresetHandlerModule(flags.config);
const FileHandler = new FileHandlerModule(file);
const Download = new DownloadModule(file);
const TaskList = new Listr([]);
let settings: CarbonCLIPresetInterface = {
  ...defaultSettings,
  language: FileHandler.getMimeType,
};

// --preset has a higher priority than default settings
if (flags.preset) {
  settings = {
    ...settings,
    ...(await PresetHandler.getPreset(flags.preset)),
  };
}

// --interactive has an even higher priority than --preset
if (flags.interactive) {
  settings = {
    ...settings,
    ...answers,
  } as CarbonCLIPresetAndAnswersIntersectionType;
}

// As long as it’s not a local --config, always save the latest run
if (!flags.config) {
  await PresetHandler.savePreset(settings.preset, settings);
}

// If --start isn’t default (1), use the original line number as the first line number
if (flags.start > 1) {
  settings = {
    ...settings,
    firstLineNumber: flags.start,
  };
}

// Task 1: Process and encode input
TaskList.add([
  {
    title: `Processing ${
      file ||
      (flags.fromClipboard ? 'input from clipboard' : 'input from stdin')
    }`,
    task: async (ctx) => {
      ctx.encodedContent = encodeURIComponent(
        await FileHandler.process(input, flags.start, flags.end)
      );
    },
  },
]);

// Task 2: Prepare things
TaskList.add([
  {
    title: 'Preparing connection',
    task: (ctx) => {
      ctx.preparedURL = `${CARBON_URL}?${stringify(
        transformToQueryParams({
          ...settings,
          code: ctx.encodedContent,
          ...(settings.custom && { t: CARBON_CUSTOM_THEME }),
        })
      )}`;
      Download.setFlags = flags;
      Download.setImgType = settings.type;
    },
  },
]);

// Task 3: Open image in browser [skippable]
TaskList.add([
  {
    title: 'Opening in browser',
    skip: !flags.openInBrowser,
    task: ({ preparedURL }) => {
      open(preparedURL);
    },
  },
]);

// Task 4: Fetch image and rename it, if necessary [skippable]
TaskList.add([
  {
    title: 'Fetching beautiful image',
    skip: flags.openInBrowser,
    task: async ({ preparedURL }) => {
      const Renderer = await RendererModule.create(
        flags.engine,
        flags.disableHeadless,
        settings.type
      );
      if (settings.custom) {
        await Renderer.setCustomTheme(settings.custom, CARBON_CUSTOM_THEME);
      }
      await Renderer.download(preparedURL, Download.getSaveDirectory);
      if (!flags.toClipboard) {
        await FileHandler.rename(
          Download.getDownloadedAsPath,
          Download.getSavedAsPath
        );
      }
    },
  },
]);

// Task 5: Copy image to clipboard [skippable]
TaskList.add([
  {
    title: 'Copying image to clipboard',
    skip: !flags.toClipboard || flags.openInBrowser,
    task: async ({ preparedURL }) => {
      await clipboard.writeImage(
        await readFileAsync(Download.getDownloadedAsPath, false)
      );
    },
  },
]);

try {
  await TaskList.run();
  console.log(await defaultSuccessView(flags, Download.getPath, settings.type));
  updateNotifier({ pkg: packageJson }).notify();
  process.exit();
} catch (e) {
  console.error(defaultErrorView((e as Error).message));
  process.exit(1);
}
