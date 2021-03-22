const http = require('http');
const vm = require('vm');

http.createServer((req, res) => {
    res.setHeader('Connection', 'close');
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    res.setHeader('Access-Control-Allow-Origin','*');

    switch (req.url) {
        case '':
        case '/':
            if ('POST' == req.method) {
                let body = [];
                req.on('error', (err) => {
                    console.err(err);
                }).on('data', (chunk) => {
                    let maxLength = 1 << 24; // 16MB
                    if (chunk.length > maxLength) {
                        req.destroy();
                        return;
                    }
                    body.push(chunk);
                }).on('end', () => {
                    let content = Buffer.concat(body).toString();
                    console.log(`input size: ${content.length} B`);
                    if (0 == content.trim().length) {
                        res.statusCode = 204;
                        res.end(null);
                        return;
                    }
                    let script, sandbox = {};
                    try {
                        script = new vm.Script(content);
                        // https://nodejs.org/dist/latest-v10.x/docs/api/vm.html#vm_script_runinnewcontext_sandbox_options
                        script.runInNewContext(sandbox);
                    } catch (err) {
                        console.error(`[${ (new Date()).toISOString() }] ${err}`);
                    }
                    console.log(sandbox);

                    res.statusCode = 200;
                    res.end(JSON.stringify(sandbox));
                });
            } else {
                res.statusCode = 405;
                res.end('Invalid request');
            }
            break;
        default:
            res.statusCode = 404;
            res.end(null);
            break;
    }
}).listen(9998);
