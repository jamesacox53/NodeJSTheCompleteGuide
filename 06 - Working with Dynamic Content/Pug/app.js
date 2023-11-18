// Core
const http = require('http');
const path = require('path');

// 3rd Party
const express = require('express');
const bodyParser = require('body-parser');

const app = express();
app.set('view engine', 'pug');
app.set('views', 'views');

const rootDirectoryStr = require('./util/rootDirectory.js');
const adminRoutes = require('./routes/admin.js');
const shopRoutes = require('./routes/shop.js');
const error404Routes = require('./routes/error404.js');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(rootDirectoryStr, 'public')));

app.use(adminRoutes);
app.use(shopRoutes);
app.use(error404Routes);

const server = http.createServer(app);

server.listen(3000);