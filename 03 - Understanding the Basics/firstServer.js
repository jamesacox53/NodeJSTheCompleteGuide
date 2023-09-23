const http = require('http');

function serverListener(request, response) {
  console.log(request);

  response.setHeader('Content-Type', 'text/html');
  response.write('<html>');
  response.write('<head><title>My First HTML Page</title></head>');
  response.write('<body><h1>Hello from my Node.js Server</h1></body>');
  response.write('</html>');
  response.end();
}

const server = http.createServer(serverListener);

server.listen(3000);