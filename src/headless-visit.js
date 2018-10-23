// Packages
const puppeteer = require('puppeteer');

module.exports = async (url, location = process.cwd(), type = 'png', headless = false) => {
	// Launch browser
	const browser = await puppeteer.launch({
		headless
	});
	// Open new page
	const page = await browser.newPage();
	// Set viewport to something big
	// Prevents Carbon from cutting off lines
	await page.setViewport({
		width: 1600,
		height: 1000,
		deviceScaleFactor: 2
	});
	// Visit specified url
	await page.goto(url, {
		waitUntil: 'load' // https://goo.gl/BdRVnv
	});

	if (headless) {
		// If `-h` set, simply screenshot the `#container` element
		// This means no svg support or 4x resolution, but a functioning
		// download for everyone without using experimental Puppeteer features
		const exportContainer = await page.waitForSelector('.export-container');
		const elementBounds = await exportContainer.boundingBox();

		await exportContainer.screenshot({
			path: `${location}/carbon.png`,
			clip: {
				...elementBounds,
				// This avoids a black line towards the left and bottom side of images,
				// which only occured when certain fonts were used, see https://goo.gl/JHHskx
				x: Math.round(elementBounds.x),
				height: Math.round(elementBounds.height) - 1
			}
		});
	} else {
		// Otherwise, allow files to be downloaded and set it to the CWD
		// Currently experimental: https://goo.gl/uxYgrW
		// Let’s hope it remains a thing… 🤞
		await page._client.send('Page.setDownloadBehavior', {
			behavior: 'allow',
			downloadPath: `${location}/`
		});

		// `page.waitForSelector` https://goo.gl/gGLKBL ➝ exactly what I needed 👍
		const saveImageTrigger = await page.waitForSelector('[aria-labelledby="downshift-2-label"]');
		// Only after this is clicked, the png and svg triggers will exist in the DOM
		await saveImageTrigger.click();

		const pngExportTrigger = await page.$('#downshift-2-item-0');
		const svgExportTrigger = await page.$('#downshift-2-item-1');

		switch (type) {
			case 'png': {
				await pngExportTrigger.click();
				break;
			}
			case 'svg': {
				await svgExportTrigger.click();
				break;
			}
			default: {
				throw new Error('Only png and svg are supported.');
			}
		}
	}

	// Wait some more as `waitUntil: 'load'` or `waitUntil: 'networkidle0'
	// is not always enough, see https://goo.gl/eTuogd
	await page.waitFor(2000);
	// Close browser
	await browser.close();
};
