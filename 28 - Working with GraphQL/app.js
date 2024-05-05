const path = require('path');
const http = require('http');

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const multer = require('multer');
const { ruruHTML } = require("ruru/server");

const rootDirectoryStr = path.dirname(require.main.filename);
const connectionStr = require(path.join(rootDirectoryStr, 'sensitive', 'mongooseDBConnectionStr.js'));
const corsHeaders = require(path.join(rootDirectoryStr, 'utils', 'middleware', 'corsHeaders.js'));
const errorHandler = require(path.join(rootDirectoryStr, 'utils', 'errorHandlers', 'errorHandler.js'));
const multerOpts = require(path.join(rootDirectoryStr, 'utils', 'multerOpts', 'multerOpts.js'));
const graphQLOpts = require(path.join(rootDirectoryStr, 'utils', 'graphQLHandler', 'graphQLHandler.js'));

const fileStorage = multer.diskStorage(multerOpts.fileStorageObj);

const app = express();
app.use(bodyParser.json());
app.use(multer({ storage: fileStorage, fileFilter: multerOpts.fileFilterFunc }).single('image'));
app.use('images', express.static(path.join(rootDirectoryStr, 'images')));
app.use(corsHeaders);
app.all("/graphql", graphQLOpts);

// Serve the GraphiQL IDE.
app.get("/", (_req, res) => {
  res.type("html")
  res.end(ruruHTML({ endpoint: "/graphql" }))
});
   
errorHandler.addErrorHandlers(app);

const server = http.createServer(app);

mongoose.connect(connectionStr)
.then(res => {
    server.listen(8080);
});