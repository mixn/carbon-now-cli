import chalk from 'chalk';

export default (preset: string) => `
  ${chalk.yellow(
    `Warning: Preset \`${preset}\` doesn’t exist. Using default settings…`,
  )}`;
