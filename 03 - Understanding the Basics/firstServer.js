const http = require('http');

function serverListener(request, response) {
  console.log(request);
}

const server = http.createServer(serverListener);

server.listen(3000);