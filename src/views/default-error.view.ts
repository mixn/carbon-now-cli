import chalk from 'chalk';

export default (error: string) => `
  ${chalk.red('Error: Sending code to https://carbon.now.sh went wrong.')}

  This is mostly due to:

  · Nonsensical input like \`--start 10 --end 2\`
  · Carbon being down or taking too long to respond
  · Your internet connection not working or being too slow

  Additional info:

  ${error}`;
