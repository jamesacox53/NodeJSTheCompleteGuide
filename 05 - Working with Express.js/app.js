// Core
const http = require('http');

// 3rd Party
const express = require('express');

const app = express();

app.use('/add-product', (request, response, next) => {
    response.send('<h1>The Product Page</h1>');
});

app.use('/', (request, response, next) => {
    response.send('<h1>Hello from Express</h1>');
});

const server = http.createServer(app);

server.listen(3000);