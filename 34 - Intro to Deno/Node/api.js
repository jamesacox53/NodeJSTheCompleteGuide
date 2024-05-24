const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');

const rootDirectoryStr = path.dirname(require.main.filename);
const todoRoutes = require(path.join(rootDirectoryStr, 'routes', 'todos.js'));

const app = express();

app.use(bodyParser.json());
app.use(todoRoutes);

app.listen(3000);