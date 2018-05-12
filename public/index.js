'use strict';

const env = require('node-env-file');
const restify = require('restify');
const validUrl = require('valid-url');
const url = require('url');
const createFetcher = require('../src/fetcher');

env(__dirname + '/../.env'); // 加载 .env 文件

let server = restify.createServer();// 创建 restify 框架服务
let fetcher = null;

server.use(restify.plugins.bodyParser({mapParams: true}));// 解析 post body 的内容

// 设置路由
server.post('/fetch/html', async (req, res, next) => {

    try {
        let reqUrl = req.params.url;
        let cookies = req.params.cookies;
        let html = "";

        if (validUrl.isUri(reqUrl)) {

            let hostname = url.parse(reqUrl).hostname;
            for (let i = 0; i < cookies.length; i++) {
                cookies[i].domain = hostname;
            }
            // console.dir(cookies);
            html = await fetcher.getHtml(reqUrl, {cookies: cookies});
        } else {
            html = "error 'url' value";
        }

        res.charSet('utf-8');
        res.header('content-type', 'text/html');
        res.send(html);
    } catch (e) {
        console.info(e.getExceptionMessage());
        next(e)
    }

});

createFetcher().then(
    createFetcher => {
        fetcher = createFetcher;
        console.info('Initialized fetcher.');
        server.listen('80', function () {
            console.log('%s listening at %s -> host:%s', server.name, server.url, process.env.HOST_PORT);
        });
    }
).catch(e => {
    console.error('Fail to initial fetcher.', e)
});

// Terminate process
process.on('SIGINT', () => {
    process.exit(0)
});


