const http = require('http');

const server = http.createServer((req, res) => {
    res.end('Hello World! (From Node)');
});

server.listen(3000);