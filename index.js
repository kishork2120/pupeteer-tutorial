const puppeteer = require('puppeteer');
const db = require('monk')('<mongo_db_connection_link>')

// Get collection object
const priceCollection = db.get('price-data');

(async () => {
  const browser = await puppeteer.launch({
    headless: true,
    devtools: false
  });

  const page = await browser.newPage();
  // await page.evaluate(() => {
  //   debugger;
  // });
  await page.goto('http://books.toscrape.com');
  await page.waitForSelector('.product_pod');
  const priceData = await page.$$eval('article', a=>{
    const product = a.map(d=>({
      product_name: d.querySelector('h3 > a').innerHTML,
      product_price: d.querySelector('div.product_price > p.price_color').innerHTML
    }));
    return product;
  });
  priceCollection.insert([...priceData])
  await browser.close();
})()

