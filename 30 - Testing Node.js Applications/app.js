import path from 'path';
import http from 'http';

import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import multer from 'multer';

import connectionStr from './sensitive/mongooseDBConnectionStr.js';
import corsHeaders from './utils/middleware/corsHeaders.js';
import errorHandler from './utils/errorHandlers/errorHandler.js';
import multerOpts from './utils/multerOpts/multerOpts.js';
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import feedRoutes from './routes/feedRoutes.js';
const fileStorage = multer.diskStorage(multerOpts.fileStorageObj);

const app = express();
app.use(bodyParser.json());
app.use(multer({ storage: fileStorage, fileFilter: multerOpts.fileFilterFunc }).single('image'));
app.use('images', express.static(path.join(path.resolve(), 'images')));
app.use(corsHeaders);

app.use(authRoutes);
app.use(userRoutes);
app.use(feedRoutes);

errorHandler.addErrorHandlers(app);

const server = http.createServer(app);

mongoose.connect(connectionStr)
.then(res => server.listen(8080));