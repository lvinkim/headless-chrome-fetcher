'use strict';

let restify = require('restify');
let env = require('node-env-file');
const puppeteer = require('puppeteer');

env(__dirname + '/../.env'); // 加载 .env 文件

let server = restify.createServer();// 创建 restify 框架服务

server.use(restify.plugins.bodyParser({mapParams: true}));// 解析 post body 的内容

// 设置路由
server.post('/fetch', async (req, res, next) => {

    try {
        let url = req.params.url;
        let html = "";
        let validUrl = require('valid-url');

        if (validUrl.isUri(url)) {

            const browser = await puppeteer.launch({args: ['--no-sandbox']});
            const page = await browser.newPage();
            await page.goto(url);
            html = await page.content()

        } else {
            html = "error 'url' value";
        }

        res.charSet('utf-8');
        res.header('content-type', 'text/html');
        res.send(html);
    } catch (e) {
        next(e)
    }

});

server.listen('80', function () {
    console.log('%s listening at %s', server.name, server.url);
});


// Terminate process
process.on('SIGINT', () => {
    process.exit(0)
});


