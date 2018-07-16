// Packages
const path = require('path');
const fs = require('fs-extra');
const puppeteer = require('puppeteer');
const renderCode = require('./helpers/render-code');

const DATA_URL_PREFIX_LENGTH = 22;

module.exports = async (url, location = process.cwd(), settings, disableSandbox = false) => {
	// Launch browser
	const browser = await puppeteer.launch({
		headless: false,
		args: disableSandbox ? ['--no-sandbox', '--disable-setuid-sandbox'] : []
	});
	// Open new page
	const page = await browser.newPage();
	// Set viewport to something big
	// Prevents Carbon from cutting off lines
	await page.setViewport({
		width: 1600,
		height: 1000
	});
	// Visit specified url
	await page.goto(url, {
		waitUntil: 'load' // https://goo.gl/BdRVnv
	});

	const data = (await renderCode(page, settings)).slice(DATA_URL_PREFIX_LENGTH);
	const buffer = Buffer.from(data, 'base64');

	const file = path.join(location, 'carbon.png');
	await fs.ensureFile(file);

	fs.writeFileSync(file, buffer);

	// Wait some more as `waitUntil: 'load'` or `waitUntil: 'networkidle0'
	// is not always enough, see https://goo.gl/eTuogd
	await page.waitFor(2000);
	// Close browser
	await browser.close();
};
