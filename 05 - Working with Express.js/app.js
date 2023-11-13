// Core
const http = require('http');

// 3rd Party
const express = require('express');
const bodyParser = require('body-parser');

const adminRoutes = require('./routes/admin.js');
const shopRoutes = require('./routes/shop.js');
const error404Routes = require('./routes/error404.js');

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));

app.use('/admin', adminRoutes);
app.use(shopRoutes);
app.use(error404Routes);

const server = http.createServer(app);

server.listen(3000);