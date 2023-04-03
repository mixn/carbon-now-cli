import chalk from 'chalk';

export default `
  ${chalk.red('No file or stdin given.')}

  ${chalk.bold('Usage')}
    $ carbon-now <file>
    $ pbpaste | carbon-now
    $ carbon-now --from-clipboard`;
