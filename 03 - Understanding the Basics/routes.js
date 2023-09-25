const fs = require('fs');

const routes = {
    serverListener: function (request, response) {
        const url = request.url;
        const method = request.method;

        if (url == '/') {
            this._sendInputFormPage(response);

        } else if (url == '/message' && method == 'POST') {
            this._storeMessageAndReDirectToInputFormPage(request, response);

        } else {
            this._sendDefaultPage(response);
        }
    },

    _sendInputFormPage: function (response) {
        response.setHeader('Content-Type', 'text/html');
        response.write('<html>');
        response.write('<head><title>My First HTML Page</title></head>');
        response.write('<body><form action="/message" method="POST"><input type="text" name="messageText"><button type="submit">Send</button></form></body>');
        response.write('</html>');

        response.end();
    },

    _storeMessageAndReDirectToInputFormPage: function (request, response) {
        const body = [];

        request.on('data', (chunk) => {
            this._addUserText(body, chunk);
        });

        request.on('end', () => {
            this._workOnCompleteUserText(body, response);
        });
    },

    _addUserText: function (bodyArr, chunk) {
        bodyArr.push(chunk);
    },

    _workOnCompleteUserText: function (bodyArr, response) {
        const parsedBody = Buffer.concat(bodyArr);
        const parsedBodyStr = parsedBody.toString();

        const messageStr = parsedBodyStr.split('=')[1];

        this._writeMessageToFileAndRedirect(messageStr, response);
    },

    _writeMessageToFileAndRedirect: function (messageStr, response) {
        fs.writeFile('message.txt', messageStr, (err) => {
            this._redirectToInputFormPage(response);
        });
    },

    _redirectToInputFormPage: function (response) {
        response.statusCode = 302;
        response.setHeader('Location', '/');
        response.end();
    },

    _sendDefaultPage: function (response) {
        response.setHeader('Content-Type', 'text/html');
        response.write('<html>');
        response.write('<head><title>My First HTML Page</title></head>');
        response.write('<body><h1>Hello from my Node.js Server</h1></body>');
        response.write('</html>');
        response.end();
    }
};

module.exports = routes;