class FileHandler {
	public static async process(
		fileContent: string,
		startLine = 0,
		endLine = 1000
	): Promise<string> {
		const NEW_LINE = '\n';
		return new Promise((resolve, reject) => {
			if (startLine > endLine) {
				return reject('Nonsensical line numbers.');
			}
			resolve(
				fileContent
					.split(NEW_LINE)
					.filter((_, index) => {
						const currentLine: number = index + 1;
						return currentLine >= startLine && currentLine <= endLine;
					})
					.join(NEW_LINE)
			);
		});
	}
}

export default FileHandler;
