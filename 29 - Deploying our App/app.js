require('dotenv').config()
// Core
const http = require('http');
const path = require('path');

// 3rd Party
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const { csrfSync } = require('csrf-sync');
const connectFlash = require('connect-flash');
const multer = require('multer');
const helmet = require('helmet');
const compression = require('compression');

const rootDirectoryStr = path.dirname(require.main.filename);
const connectionStr = require(path.join(rootDirectoryStr, 'sensitive', 'mongooseDBConnectionStr.js'));
const expressSession = require(path.join(rootDirectoryStr, 'sessions', 'expressSession.js'));
const csrfSyncOptionsObj = require(path.join(rootDirectoryStr, 'csrf', 'csrfSyncObj.js'));
const multerOpts = require(path.join(rootDirectoryStr, 'utils', 'multerOpts', 'multerOpts.js'));

const addViewRenderVariables = require(path.join(rootDirectoryStr, 'middleware', 'addViewRenderVariables.js'));
const userMiddleware = require(path.join(rootDirectoryStr, 'middleware', 'userMiddleware.js'));

const adminRoutes = require(path.join(rootDirectoryStr, 'routes', 'adminRoutes.js'));
const authRoutes = require(path.join(rootDirectoryStr, 'routes', 'authRoutes.js'));
const shopRoutes = require(path.join(rootDirectoryStr, 'routes', 'shopRoutes.js'));
const errorRoutes = require(path.join(rootDirectoryStr, 'routes', 'errorRoutes.js'));

const errorHandler = require(path.join(rootDirectoryStr, 'errorHandlers', 'errorHandler.js'));

const fileStorage = multer.diskStorage(multerOpts.fileStorageObj);
const { csrfSynchronisedProtection } = csrfSync(csrfSyncOptionsObj);

const app = express();
app.set('view engine', 'ejs');
app.set('views', 'views');

app.use(helmet());
app.use(compression());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(multer({ storage: fileStorage, fileFilter: multerOpts.fileFilterFunc }).single('image'));
app.use(express.static(path.join(rootDirectoryStr, 'public')));
app.use('/images', express.static(path.join(rootDirectoryStr, 'images')));
app.use(expressSession);
app.use(csrfSynchronisedProtection);
app.use(connectFlash());

app.use(addViewRenderVariables);
app.use(userMiddleware);

app.use(adminRoutes);
app.use(authRoutes);
app.use(shopRoutes);
app.use(errorRoutes);

errorHandler.addErrorHandlers(app);

const server = http.createServer(app);

mongoose.connect(connectionStr)
.then(res => server.listen(process.env.PORT));