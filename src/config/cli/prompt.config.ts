import { CONFIG_LATEST_PRESET } from '../../helpers/cli/constants.helper.js';
import { mappingsConfig } from '../carbon/mappings.config.js';

export default [
  {
    type: 'list',
    name: 't',
    message: 'Syntax theme:',
    default: '3024 Night',
    choices: Object.keys(mappingsConfig.t),
  },
  {
    type: 'list',
    name: 'wt',
    message: 'Window theme:',
    default: 'none',
    choices: Object.keys(mappingsConfig.wt),
  },
  {
    type: 'list',
    name: 'fm',
    message: 'Font family:',
    default: 'Hack',
    choices: Object.keys(mappingsConfig.fm),
  },
  {
    type: 'input',
    name: 'fs',
    message: 'Font size:',
    default: '18px',
  },
  {
    type: 'input',
    name: 'bg',
    message: 'Background color:',
    default: '#ADB7C1',
  },
  {
    type: 'confirm',
    name: 'wc',
    message: 'Include window controls?',
    default: true,
  },
  {
    type: 'confirm',
    name: 'ln',
    message: 'Include line numbers?',
    default: false,
  },
  {
    type: 'input',
    name: 'fl',
    message: 'Starting line number?',
    default: '1',
    when: (answers: CarbonCLIPromptAnswersInterface) => answers.ln,
  },
  {
    type: 'confirm',
    name: 'wa',
    message: 'Auto adjust width?',
    default: true,
  },
  {
    type: 'input',
    name: 'lh',
    message: 'Line height:',
    default: '133%',
  },
  {
    type: 'input',
    name: 'pv',
    message: 'Vertical padding:',
    default: '0px',
  },
  {
    type: 'input',
    name: 'ph',
    message: 'Horizontal padding:',
    default: '0px',
  },
  {
    type: 'confirm',
    name: 'ds',
    message: 'Include drop shadow?',
    default: false,
  },
  {
    type: 'input',
    name: 'dsyoff',
    message: 'Drop shadow y-offset:',
    default: '20px',
    when: (answers: CarbonCLIPromptAnswersInterface) => answers.ds,
  },
  {
    type: 'input',
    name: 'dsblur',
    message: 'Drop shadow blur:',
    default: '68px',
    when: (answers: CarbonCLIPromptAnswersInterface) => answers.ds,
  },
  {
    type: 'confirm',
    name: 'highlight',
    message: 'Highlight certain lines?',
    default: false,
  },
  {
    type: 'input',
    name: 'sl',
    message: 'Comma-separated list of lines to highlight, e.g., 4,5,6,7',
    default: '*',
    when: (answers: CarbonCLIPromptAnswersInterface) => answers.highlight,
  },
  {
    type: 'confirm',
    name: 'si',
    message: 'Make squared image?',
    default: false,
  },
  {
    type: 'confirm',
    name: 'wm',
    message: 'Add Carbon watermark?',
    default: false,
  },
  {
    type: 'list',
    name: 'es',
    message: 'Export size:',
    default: '2x',
    choices: Object.keys(mappingsConfig.es),
  },
  {
    type: 'list',
    name: 'type',
    message: 'Export as…',
    default: 'png',
    choices: ['png', 'svg'],
  },
  {
    type: 'confirm',
    name: 'save',
    message: 'Save these settings as a preset?',
    default: false,
  },
  {
    type: 'input',
    name: 'preset',
    message: 'Name of the preset? Use kebab-case.',
    default: CONFIG_LATEST_PRESET,
    when: (answers: CarbonCLIPromptAnswersInterface) => answers.save,
  },
];
