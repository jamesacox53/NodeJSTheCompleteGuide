const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');

const rootDirectoryStr = path.dirname(require.main.filename);
const feedRoutes = require(path.join(rootDirectoryStr, 'routes', 'feedRoutes'));

const app = express();
app.use(bodyParser.json());

app.use(feedRoutes);

app.listen(8080);