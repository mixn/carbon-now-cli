/* global window */
/* global document */

const filter = n => {
	// %[00 -> 19] cause failures
	if (
		n.innerText && n.innerText.match(/%[0-1]\d/) &&
    n.className &&
    n.className.startsWith('cm-') // Is CodeMirror primitive string
	) {
		n.innerText = n.innerText.replace('%', '%25');
	}
	if (n.className) {
		return String(n.className).indexOf('eliminateOnRender') < 0;
	}
	return true;
};

module.exports = async (page, {es = 2, si = false, type = 'png'}) => {
	await page.evaluate(() => {
		window.module = undefined; // Carbon-now.sh has a module.exports variable somehow
	});

	await page.addScriptTag({
		path: require.resolve('dom-to-image')
	});

	return page.evaluate((es, si, type, filter) => {
		const node = document.getElementById('export-container');

		// EXPORT SIZES=1,2,4
		const width = node.offsetWidth * es;
		const height = si ?
			node.offsetWidth * es :
			node.offsetHeight * es;

		const config = {
			style: {
				transform: `scale(${es})`,
				'transform-origin': 'center',
				background: 'none' // This.state.si ? this.state.backgroundColor : 'none'
			},
			filter,
			width,
			height
		};
		// We need regular dataurls
		if (type === 'svg') {
			return window.domtoimage.toSvg(node, config);
		}
		return window.domtoimage.toPng(node, config);
	}, es, si, type, filter);
};
