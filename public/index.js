'use strict';

const env = require('node-env-file');
const restify = require('restify');
const validUrl = require('valid-url');
const createFetcher = require('../src/fetcher');

env(__dirname + '/../.env'); // 加载 .env 文件

let server = restify.createServer();// 创建 restify 框架服务
let fetcher = null;

server.use(restify.plugins.bodyParser({mapParams: true}));// 解析 post body 的内容

// 设置路由
server.post('/fetch/html', async (req, res, next) => {

    try {
        let url = req.params.url;
        let html = "";

        if (validUrl.isUri(url)) {
            html = await fetcher.getHtml(url, {});
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

createFetcher().then(
    createFetcher => {
        fetcher = createFetcher;
        console.info('Initialized fetcher.');
        server.listen('80', function () {
            console.log('%s listening at %s', server.name, server.url);
        });
    }
).catch(e => {
    console.error('Fail to initial fetcher.', e)
});

// Terminate process
process.on('SIGINT', () => {
    process.exit(0)
});


