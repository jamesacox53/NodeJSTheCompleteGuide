const path = require('path');
const http = require('http');
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const rootDirectoryStr = path.dirname(require.main.filename);
const connectionStr = require(path.join(rootDirectoryStr, 'sensitive', 'mongooseDBConnectionStr.js'));
const corsHeaders = require(path.join(rootDirectoryStr, 'utils', 'middleware', 'corsHeaders.js'));
const errorHandler = require(path.join(rootDirectoryStr, 'utils', 'errorHandlers', 'errorHandler.js'));

const feedRoutes = require(path.join(rootDirectoryStr, 'routes', 'feedRoutes'));

const app = express();
app.use(bodyParser.json());
app.use('images', express.static(path.join(rootDirectoryStr, 'images')));
app.use(corsHeaders);

app.use(feedRoutes);

errorHandler.addErrorHandlers(app);

const server = http.createServer(app);

mongoose.connect(connectionStr)
.then(res => server.listen(8080));