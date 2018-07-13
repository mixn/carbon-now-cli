// Packages
const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');

module.exports = async (url, location = process.cwd(), type = 'png', disableSandbox = false) => {
	// Launch browser
	const browser = await puppeteer.launch({
		headless: false,
		args: disableSandbox ? ['--no-sandbox', '--disable-setuid-sandbox'] : [],
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
	// Allow files to be downloaded and set it to the CWD
	// Currently experimental: https://goo.gl/uxYgrW
	// Let’s hope it remains a thing… 🤞
	await page._client.send('Page.setDownloadBehavior', {
		behavior: 'allow',
		downloadPath: `${location}/`
	});

	await page.addScriptTag({
		path: path.resolve(__dirname,
			'..', 
			'node_modules', 
			'dom-to-image', 
			'src', 
			'dom-to-image.js')
	});

	await page.evaluate(() => {
		if (typeof domtoimage === 'undefined' && module.exports) {
			window.domtoimage = module.exports;
		}
	});
	
	const dataUrl = await page.evaluate(() => {
    const node = document.getElementById('export-container')

		// EXPORT SIZES=1,2,4
    const exportSize = 2;
    const width = node.offsetWidth * exportSize;
    const height = false //true for squared image
      ? node.offsetWidth * exportSize
      : node.offsetHeight * exportSize;

    const config = {
      style: {
        transform: `scale(${exportSize})`,
        'transform-origin': 'center',
        background: 'none' //this.state.squaredImage ? this.state.backgroundColor : 'none'
      },
      filter: n => {
        // %[00 -> 19] cause failures
        if (
          n.innerText && n.innerText.match(/%[0-1][0-9]/) &&
          n.className &&
          n.className.startsWith('cm-') // is CodeMirror primitive string
        ) {
          n.innerText = n.innerText.replace('%', '%25')
        }
        if (n.className) {
          return String(n.className).indexOf('eliminateOnRender') < 0
        }
        return true
      },
      width,
      height
    }
    // we need regular dataurls
    return window.domtoimage.toPng(node, config)
	});

	console.log('fetched data url');
	const data = dataUrl.slice("data:image/png;base64,".length)
	const buffer = new Buffer(data, 'base64');
	fs.writeFileSync('carbon.png', buffer);
	console.log('wrote image to carbon.png');

	// Wait some more as `waitUntil: 'load'` or `waitUntil: 'networkidle0'
	// is not always enough, see https://goo.gl/eTuogd
	await page.waitFor(2000);
	// Close browser
	await browser.close();
};
