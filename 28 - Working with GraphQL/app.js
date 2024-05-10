const path = require('path');
const fs = require('fs');
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
const graphQLHandler = require(path.join(rootDirectoryStr, 'utils', 'graphQLHandler', 'graphQLHandler.js'));
const auth = require(path.join(rootDirectoryStr, 'utils', 'middleware', 'auth.js'));

const fileStorage = multer.diskStorage(multerOpts.fileStorageObj);

const app = express();
app.use(bodyParser.json());
app.use(multer({ storage: fileStorage, fileFilter: multerOpts.fileFilterFunc }).single('image'));
app.use('images', express.static(path.join(rootDirectoryStr, 'images')));
app.use(corsHeaders);
app.use(auth);

app.put('/post-image', (req, res, next) => {
  if (!req.isAuth)
    throw new Error('Not authenticated');
  
  if (!req.file)
    return res.status(200).json({ message: 'No file provided!' });

  if (req.body.oldPath)
    clearImage(req.body.oldPath)  

  return res.status(201).json({ message: 'File stored.', filePath: req.file.path });

  function clearImage(filePath) {
    // filePath = path.join(__dirname, '..', filePath);
    fs.unlink(filePath, err => console.log(err));
  }
});

app.all("/graphql", graphQLHandler);

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