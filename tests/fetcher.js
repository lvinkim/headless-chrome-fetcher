'use strict';

const puppeteer = require('puppeteer');

(async () => {

    // const browser = await puppeteer.launch({
    //     executablePath: '/usr/bin/google-chrome-unstable'
    // });

    const browser = await puppeteer.launch({args: ['--no-sandbox']}); //用指定选项启动一个Chromium浏览器实例。
    const page = await browser.newPage(); //创建一个页面.
    await page.goto('http://m.xiyanghui.com/productDetail/5a62c68a665b4d114c8b4aa2'); //打开指定页面


    const price = await page.evaluate(() =>
        document.querySelector('.price-1uPl2m > span').innerText
    );  // 抓取产品价格

    console.log("产品价格: " + price);

    await page.screenshot({path: 'm.xiyanghui.png'}); //截图并保存

    await browser.close(); //关闭

})();