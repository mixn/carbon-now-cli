// Packages
const puppeteer = require('puppeteer');

module.exports = async (url, location = process.cwd()) => {
	// Launch browser
	const browser = await puppeteer.launch();
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
		downloadPath: `${location}/`
	});
	const saveImageTrigger = await page.waitForSelector('[aria-labelledby="downshift-2-label"]');
	await saveImageTrigger.click();

	const pngExportTrigger = await page.$('#downshift-2-item-0');
	await pngExportTrigger.click();

	// Wait some more as `waitUntil: 'load'` or `waitUntil: 'networkidle0'
	// is not always enough, see https://goo.gl/eTuogd
	await page.waitFor(2000);

	await browser.close();
};
