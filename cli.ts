#!/usr/bin/env node

import task from 'tasuku';
import PromptModule from './src/modules/prompt.module.js';
import { CARBON_URL } from './src/helpers/carbon/constants.helper.js';

const Prompt = await PromptModule.create();
const file = Prompt.getFile;
const flags = Prompt.getFlags;
const answers = Prompt.getAnswers;
const input = Prompt.getInput;

console.log(file, flags, answers, input);

// await task('Task 2', async ({ setStatus, setOutput }) => {
// 	await sleep(1000);
// });

// await task('Task 3', async ({ setStatus, setOutput }) => {
// 	await sleep(1000);
// });
