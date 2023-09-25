const http = require('http');
const routes = require('./routes');

const server = http.createServer((request, response) => {
  routes.serverListener(request, response);
});

server.listen(3000);