const http = require('http');
const fs = require('fs');

function serverListener(request, response) {
  const url = request.url;
  const method = request.method;

  if (url == '/') {
    return sendInputFormPage(response);

  } else if (url == '/message' && method == 'POST') {
    return storeMessageAndReDirectToInputFormPage(request, response);

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

  response.end();
}

function storeMessageAndReDirectToInputFormPage(request, response) {
  const body = [];

  request.on('data', (chunk) => {
    _addUserText(body, chunk);
  });

  request.on('end', () => {
    _workOnCompleteUserText(body, response);
  });
}

function _addUserText(bodyArr, chunk) {
  bodyArr.push(chunk);
}

function _workOnCompleteUserText(bodyArr, response) {
  const parsedBody = Buffer.concat(bodyArr);
  const parsedBodyStr = parsedBody.toString();

  const messageStr = parsedBodyStr.split('=')[1];

  _writeMessageToFileAndRedirect(messageStr, response);
}

function _writeMessageToFileAndRedirect(messageStr, response) {
  fs.writeFile('message.txt', messageStr, (err) => {
    _redirectToInputFormPage(response);
  });
}

function _redirectToInputFormPage(response) {
  response.statusCode = 302;
  response.setHeader('Location', '/');
  response.end();
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