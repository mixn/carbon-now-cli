import clipboard from 'clipboardy';
import PromptModule from '../../../src/modules/prompt.module.js';
import { DUMMY_INPUT } from '../../helpers/constants.helper.js';
import { vi, describe, it, expect } from 'vitest';

vi.mock('get-stdin');

process.argv.push('--from-clipboard');

describe('PromptModule via --from-clipboard', () => {
  it('should correctly accept input from clipboard if --from-clipboard is set', async () => {
    clipboard.writeSync(DUMMY_INPUT);
    expect((await PromptModule.create()).getFile).toBe(undefined);
    expect((await PromptModule.create()).getInput).toBe(DUMMY_INPUT);
  });
});
