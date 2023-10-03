// Core
const http = require('http');

// 3rd Party
const express = require('express');
const bodyParser = require('body-parser');

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));

app.use('/add-product', (request, response, next) => {
    response.send('<form action="/product" method="POST"><input type="text" name="messageText"><button type="submit">Send</button></form>');
});

app.post('/product', (request, response, next) => {
    console.log(request.body);
    response.redirect('/');
});

app.use('/', (request, response, next) => {
    response.send('<h1>Hello from Express</h1>');
});

const server = http.createServer(app);

server.listen(3000);