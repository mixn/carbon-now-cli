import { homedir } from 'os';

const CONFIG_FILE = '.carbon-now.json';
export const HOMEDIR = homedir();
export const CONFIG_PATH = `${HOMEDIR}/${CONFIG_FILE}`;
export const CONFIG_LATEST_PRESET = 'latest-preset';
