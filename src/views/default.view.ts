import chalk from 'chalk';

export default `
  ${chalk.bold('Usage')}
    $ carbon-now <file>
    $ pbpaste | carbon-now
    $ carbon-now --from-clipboard

  ${chalk.bold('Options')}
    -s, --start          Starting line of input
    -e, --end            Ending line of input
    -i, --interactive    Interactive mode
    -p, --preset         Apply an existing preset
    --save-to            Image save location, default: cwd
    --save-as            Image name, default: original-hash.{png|svg}
    --from-clipboard     Read input from clipboard instead of file
    --to-clipboard       Copy image to clipboard
    --open-in-browser    Open in browser instead of saving
    --config             Use a different, local config (read-only)
    --disable-headless   Run Playwright in headful mode
    --engine             Use different rendering engine, default: \`chromium\`
                         Options: \`chromium\`, \`firefox\`, \`webkit\`

  ${chalk.bold('Examples')}
    See: https://github.com/mixn/carbon-now-cli#examples
`;
