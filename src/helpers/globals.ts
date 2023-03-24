// Native
import { homedir } from 'os';

export const HOMEDIR = homedir();
export const CONFIG_FILE = '.carbon-now.json';
const CONFIG_DUMMY = '.carbon-now-dummy.json';
export const FULL_CONFIG_PATH = `${HOMEDIR}/${CONFIG_FILE}`;
export const FULL_DUMMY_CONFIG_PATH = `${HOMEDIR}/${CONFIG_DUMMY}`;
export const CARBON_URL = 'https://carbon.now.sh/';
export const LATEST_PRESET = 'latest-preset';
