import readFileAsync from '../../src/utils/read-file-async.util.js';

describe('readFileAsync', () => {
  it('should read file asynchronously correctly', async () => {
    const expected = `fn main() {
	println!("Hello World!");
}
`;
    expect(await readFileAsync('./test/test-dummies/_main.rs')).toBe(expected);
  });

  it('should utf-8 encode by default', async () => {
    expect(typeof (await readFileAsync('./test/test-dummies/_main.rs'))).toBe(
      'string',
    );
  });

  it('should return a Buffer when told to skip default encoding', async () => {
    expect(
      (await readFileAsync('./test/test-dummies/_main.rs', false)) instanceof
        Buffer,
    ).toBe(true);
  });
});
