import { homedir } from 'os';

const CONFIG_DUMMY = '.carbon-now-dummy.json';
export const HOMEDIR = homedir();
export const CONFIG_FILE = '.carbon-now.json';
export const CONFIG_PATH = `${HOMEDIR}/${CONFIG_FILE}`;
export const CONFIG_DUMMY_PATH = `${HOMEDIR}/${CONFIG_DUMMY}`;
export const CONFIG_LATEST_PRESET = 'latest-preset';
export const DEFAULT_TASK_WARNING = 'Skipped';
