// Core
const http = require('http');
const path = require('path');

// 3rd Party
const express = require('express');
const bodyParser = require('body-parser');

const app = express();
app.set('view engine', 'ejs');
app.set('views', 'views');

const rootDirectoryStr = path.dirname(require.main.filename);
const sequelize = require(path.join(rootDirectoryStr, 'util', 'mySqlDatabaseCreds.js'));
const sequelizeAssociations = require(path.join(rootDirectoryStr, 'models', 'associations.js'));

const adminRoutes = require(path.join(rootDirectoryStr, 'routes', 'adminRoutes.js'));
const shopRoutes = require(path.join(rootDirectoryStr, 'routes', 'shopRoutes.js'));
const errorRoutes = require(path.join(rootDirectoryStr, 'routes', 'errorRoutes.js'));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(rootDirectoryStr, 'public')));

app.use(adminRoutes);
app.use(shopRoutes);
app.use(errorRoutes);

const server = http.createServer(app);

sequelize.sync({ force: true })
.then(res => server.listen(3000))
.catch(err => console.log(err));