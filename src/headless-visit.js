// Packages
const puppeteer = require('puppeteer');

module.exports = async url => {
	// Launch browser
	const browser = await puppeteer.launch({
		headless: false
	});
	// Open new page
	const page = await browser.newPage();
	// Visit specified url
	await page.goto(url, {
		waitUntil: 'load' // https://goo.gl/BdRVnv
	});
	// Allow files to be downloaded and set it to the CWD
	// Currently experimental: https://goo.gl/uxYgrW
	// Let’s hope it remains a thing… 🤞
	await page._client.send('Page.setDownloadBehavior', {
		behavior: 'allow',
		downloadPath: './'
	});
	const saveImageTrigger = await page.waitForSelector('[aria-labelledby="downshift-2-label"]');
	await saveImageTrigger.click();

	const pngExportTrigger = await page.$('#downshift-2-item-0');
	await pngExportTrigger.click();

	await page.waitFor(1500);

	await browser.close();
};
