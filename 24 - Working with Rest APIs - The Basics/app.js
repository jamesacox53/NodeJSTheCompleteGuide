const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');

const rootDirectoryStr = path.dirname(require.main.filename);
const feedRoutes = require(path.join(rootDirectoryStr, 'routes', 'feedRoute'));

const app = express();

app.use(feedRoutes);

app.listen(8080);