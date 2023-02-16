var fs = require('fs')
const puppeteer = require('puppeteer');
const chalk = require('chalk');


const launchSessionHarvester = async () => {
    while (true) {
        const browser = await puppeteer.launch({ headless: true });
        const page = await browser.newPage();
        const result = [];


        await page.goto('https://mschf.com/shop/super-normal-2/', {
            waitUntil: 'networkidle0',
        });


        await page.select('select[name="Size"]', "c7d22474-3562-4d52-8934-80e19f701459");
        await page.click('#__layout > div > section > div.bar.product-details-bar.onSale > div.bar-cta > a > span.inner > span.inner-text');
        const pageTarget = page.target();

        const newTarget = await browser.waitForTarget(target => target.opener() === pageTarget);





        //get the new page object:
        const newPage = await newTarget.page();
        await newPage.waitForNavigation({ waitUntil: 'networkidle2' })
        // await newPage.waitForTimeout(5000)
        await newPage.setRequestInterception(true);

        newPage.reload()

        newPage.on('request', req => {
            if (req.headers().authorization) {
                // console.log(req.headers().authorization);
                var data = fs.readFileSync('guestSessions.json');
                var myObject = JSON.parse(data);
                myObject.push(req.headers().authorization);
                var newData = JSON.stringify(myObject);
                fs.writeFile('guestSessions.json', newData, err => {
                    // error checking
                    if (err) throw err;
                    console.log(chalk.cyan('Harvested session: ') + chalk.green(req.headers().authorization));
                });
                browser.close()
            }
            req.continue()
        });
    }
}

module.exports = {
    launchSessionHarvester
}