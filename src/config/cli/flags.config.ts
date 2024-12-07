import { CONFIG_LATEST_PRESET } from '../../helpers/cli/constants.helper.js';

export default {
  start: {
    type: 'number',
    shortFlag: 's',
    default: 1,
  },
  end: {
    type: 'number',
    shortFlag: 'e',
    default: 1000,
  },
  openInBrowser: {
    type: 'boolean',
    default: false,
  },
  saveTo: {
    type: 'string',
    default: process.cwd(),
  },
  saveAs: {
    type: 'string',
  },
  interactive: {
    type: 'boolean',
    shortFlag: 'i',
    default: false,
  },
  preset: {
    type: 'string',
    shortFlag: 'p',
    default: CONFIG_LATEST_PRESET,
  },
  toClipboard: {
    type: 'boolean',
    default: false,
  },
  config: {
    type: 'string',
  },
  configJson: {
    type: 'string',
  },
  fromClipboard: {
    type: 'boolean',
    default: false,
  },
  disableHeadless: {
    type: 'boolean',
    default: false,
  },
  engine: {
    type: 'string',
    default: 'chromium',
  },
  skipDisplay: {
    type: 'boolean',
    default: false,
  },
} as const;
