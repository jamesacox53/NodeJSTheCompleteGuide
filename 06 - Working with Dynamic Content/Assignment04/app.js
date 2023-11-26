// Core
const http = require('http');
const path = require('path');

// 3rd Party
const express = require('express');
const bodyParser = require('body-parser');

const app = express();
app.set('view engine', 'ejs');
app.set('views', 'views');

const rootDirectoryStr = require('./util/rootDirectory.js');
const usersRoutes = require('./routes/users.js');
const rootRoutes = require('./routes/root.js');
const error404Routes = require('./routes/error404.js');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(rootDirectoryStr, 'public')));

app.use(usersRoutes);
app.use(rootRoutes);
app.use(error404Routes);

const server = http.createServer(app);

server.listen(3000);