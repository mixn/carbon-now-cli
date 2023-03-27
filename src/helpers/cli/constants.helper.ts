import { homedir } from 'os';

export const HOMEDIR = homedir();
export const CONFIG_FILE = '.carbon-now.json';

const CONFIG_DUMMY = '.carbon-now-dummy.json';
export const CONFIG_PATH = `${HOMEDIR}/${CONFIG_FILE}`;
export const CONFIG_DUMMY_PATH = `${HOMEDIR}/${CONFIG_DUMMY}`;
export const CONFIG_LATEST_PRESET = 'latest-preset';
