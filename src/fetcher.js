'use strict';

const puppeteer = require('puppeteer');

class Fetcher {

    /**
     * 构造函数
     * @param browser
     */
    constructor(browser) {
        this.browser = browser;
    }

    /**
     * 打开页面
     * @param url
     * @param timeout
     * @param waitUntil
     * @param cookies
     * @returns {Promise<void>}
     */
    async createPage(url, {timeout, waitUntil, cookies = []}) {
        let gotoOptions = {
            timeout: Number(timeout) || 30 * 1000,  // 30 秒超时
            waitUntil: waitUntil || 'networkidle2', //
        };

        const page = await this.browser.newPage();
        await page.setUserAgent("Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/66.0.3359.139 Safari/537.36");
        // console.dir(cookies);
        await page.setCookie(...cookies);
        await page.goto(url, gotoOptions);
        return page;
    }

    /**
     * 抓取 html
     * @param url
     * @param options
     * @returns {Promise<*>}
     */
    async getHtml(url, options) {
        let page = null;
        try {
            const {timeout, waitUntil, cookies} = options;
            page = await this.createPage(url, {timeout, waitUntil, cookies});
            return await page.content();
        } finally {
            if (page) {
                await page.close();
            }
        }
    }

    /**
     * 关闭浏览器
     * @returns {Promise<void>}
     */
    async close() {
        await this.browser.close();
    }

}

/**
 *
 * @returns {Promise<Fetcher>}
 */
async function create() {
    const browser = await puppeteer.launch({args: ['--no-sandbox']});
    console.info(await browser.version());
    return new Fetcher(browser)
}

/**
 *
 * @type {function(): Fetcher}
 */
module.exports = create;