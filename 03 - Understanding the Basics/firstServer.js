const http = require('http');

function serverListener(request, response) {
  const url = request.url;

  if (url == '/') {
    return sendInputFormPage(response);

  } else {
    return sendDefaultPage(response);
  }
}

function sendInputFormPage(response) {
  response.setHeader('Content-Type', 'text/html');
  response.write('<html>');
  response.write('<head><title>My First HTML Page</title></head>');
  response.write('<body><form action="/message" method="POST"><input type="text" name="messageText"><button type="submit">Send</button></form></body>');
  response.write('</html>');

  return response.end();
}

function sendDefaultPage(response) {
  response.setHeader('Content-Type', 'text/html');
  response.write('<html>');
  response.write('<head><title>My First HTML Page</title></head>');
  response.write('<body><h1>Hello from my Node.js Server</h1></body>');
  response.write('</html>');
  response.end();
}

const server = http.createServer(serverListener);

server.listen(3000);