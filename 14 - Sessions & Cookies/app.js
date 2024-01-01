// Core
const http = require('http');
const path = require('path');

// 3rd Party
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const app = express();
app.set('view engine', 'ejs');
app.set('views', 'views');

const rootDirectoryStr = path.dirname(require.main.filename);
const connectionStr = require(path.join(rootDirectoryStr, 'database', 'mongooseDBCreds.js'));
const expressSession = require(path.join(rootDirectoryStr, 'sessions', 'expressSessionCreds.js'));
const userMiddleware = require(path.join(rootDirectoryStr, 'util', 'userMiddleware.js'));

const adminRoutes = require(path.join(rootDirectoryStr, 'routes', 'adminRoutes.js'));
const authRoutes = require(path.join(rootDirectoryStr, 'routes', 'authRoutes.js'));
const shopRoutes = require(path.join(rootDirectoryStr, 'routes', 'shopRoutes.js'));
const errorRoutes = require(path.join(rootDirectoryStr, 'routes', 'errorRoutes.js'));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(rootDirectoryStr, 'public')));
app.use(expressSession);
app.use(userMiddleware);

app.use(adminRoutes);
app.use(authRoutes);
app.use(shopRoutes);
app.use(errorRoutes);

const server = http.createServer(app);

mongoose.connect(connectionStr)
.then(res => server.listen(3000));