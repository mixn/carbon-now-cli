import chalk from 'chalk';
import terminalImage from 'terminal-image';

export default async (
  flags: CarbonCLIFlagsInterface,
  path: string,
  type: CarbonCLIDownloadType,
) => {
  let successMessage = `
  ${chalk.green('Done!')}
	`;

  switch (true) {
    case flags.openInBrowser: {
      successMessage += `
  Browser opened — finish your image there! 😌`;
      break;
    }
    case flags.toClipboard: {
      successMessage += `
  Image copied to clipboard! 😌`;
      break;
    }
    default: {
      successMessage = `
  The file can be found here: ${path} 😌
	`;

      if (
        process.env.TERM_PROGRAM &&
        process.env.TERM_PROGRAM.match('iTerm') &&
        type === 'png' &&
        !flags.skipDisplay
      ) {
        successMessage += `
  iTerm2 should display the image below. 😊
  ${await terminalImage.file(path)}`;
      }
    }
  }

  return successMessage;
};
