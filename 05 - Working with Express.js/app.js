// Core
const http = require('http');

// 3rd Party
const express = require('express');


const app = express();
const server = http.createServer(app);

server.listen(3000);