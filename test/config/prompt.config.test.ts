import promptConfig from '../../src/config/cli/prompt.config.js';
import dummyConfig from './../test-dummies/_config.json' assert { type: 'json' };

describe('promptConfig', () => {
  it('should have the same `name` values as a preset has setting keys', async () => {
    expect(promptConfig.map((prompt) => prompt.name)).toEqual(
      expect.arrayContaining(Object.keys(dummyConfig['dummy-preset'])),
    );
  });
});
