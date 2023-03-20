module.exports = (input, START = 0, END = 1000) => {
	const NEW_LINE = '\n';

	return new Promise((resolve, reject) => {
		// Reject immediately when nonsensical input
		if (START > END) {
			return reject();
		}

		// Otherwise resolve with the correct section
		resolve(
			input
				.split(NEW_LINE)
				.filter((line, index) => {
					const CURRENT_LINE = index + 1;
					return CURRENT_LINE >= START && CURRENT_LINE <= END;
				})
				.join(NEW_LINE)
		);
	});
};
