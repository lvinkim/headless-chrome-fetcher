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
     * @returns {Promise<void>}
     */
    async createPage(url, {timeout, waitUntil}) {
        let gotoOptions = {
            timeout: Number(timeout) || 30 * 1000,  // 30 秒超时
            waitUntil: waitUntil || 'networkidle2', //
        };

        const page = await this.browser.newPage();
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
            const {timeout, waitUntil} = options;
            page = await this.createPage(url, {timeout, waitUntil});
            const html = await page.content();
            return html;
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
    const browser = await puppeteer.launch({args: ['--no-sandbox']})
    return new Fetcher(browser)
}

/**
 *
 * @type {function(): Fetcher}
 */
module.exports = create;