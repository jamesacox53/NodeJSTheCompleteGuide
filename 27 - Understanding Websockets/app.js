const path = require('path');
const http = require('http');

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const multer = require('multer');

const rootDirectoryStr = path.dirname(require.main.filename);
const connectionStr = require(path.join(rootDirectoryStr, 'sensitive', 'mongooseDBConnectionStr.js'));
const corsHeaders = require(path.join(rootDirectoryStr, 'utils', 'middleware', 'corsHeaders.js'));
const errorHandler = require(path.join(rootDirectoryStr, 'utils', 'errorHandlers', 'errorHandler.js'));
const multerOpts = require(path.join(rootDirectoryStr, 'utils', 'multerOpts', 'multerOpts.js'));
const sockets = require(path.join(rootDirectoryStr, 'utils', 'sockets', 'sockets.js'));

const authRoutes = require(path.join(rootDirectoryStr, 'routes', 'authRoutes.js'));
const userRoutes = require(path.join(rootDirectoryStr, 'routes', 'userRoutes.js'));
const feedRoutes = require(path.join(rootDirectoryStr, 'routes', 'feedRoutes.js'));
const fileStorage = multer.diskStorage(multerOpts.fileStorageObj);

const app = express();
app.use(bodyParser.json());
app.use(multer({ storage: fileStorage, fileFilter: multerOpts.fileFilterFunc }).single('image'));
app.use('images', express.static(path.join(rootDirectoryStr, 'images')));
app.use(corsHeaders);

app.use(authRoutes);
app.use(userRoutes);
app.use(feedRoutes);

errorHandler.addErrorHandlers(app);

const server = http.createServer(app);

mongoose.connect(connectionStr)
.then(res => {
    const activeServer = server.listen(8080);
    sockets.addSocket(activeServer);
});