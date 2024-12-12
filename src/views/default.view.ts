import chalk from 'chalk';

export default `
  ${chalk.bold('Usage')}
    $ carbon-now <file>
    $ pbpaste | carbon-now
    $ carbon-now --from-clipboard

  ${chalk.bold('Options')}
    --start, -s          Starting line of input
    --end, -e            Ending line of input
    --interactive, -i    Interactive mode
    --preset, -p         Apply an existing preset
    --save-to            Image save location, default: cwd
    --save-as            Image name without extension, default: original-hash
    --from-clipboard     Read input from clipboard instead of file
    --to-clipboard       Copy image to clipboard instead of saving
    --open-in-browser    Open in browser instead of saving
    --config             Use a different, local config (read-only)
    --settings           Override specific settings for this run
    --disable-headless   Run Playwright in headful mode
    --engine             Use different rendering engine, default: \`chromium\`
                         Options: \`chromium\`, \`firefox\`, \`webkit\`
    --skip-display       Don’t display the image in the terminal

  ${chalk.bold('Examples')}
    See: https://github.com/mixn/carbon-now-cli#examples
`;
