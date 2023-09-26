const routes = {
    serverListener: function (request, response) {
        const url = request.url;
        const method = request.method;

        if (url == '/') {
            this._sendUserCreationPage(response);

        } else if (url == '/users') {
            this._sendUserListPage(response);

        } else if (url == '/create-user' && method == 'POST') {
            this._handleUserCreationAndRedirectToUserCreationPage(request, response);

        } else {
            this._sendUserCreationPage(response);
        }
    },

    _sendUserCreationPage: function (response) {
        response.setHeader('Content-Type', 'text/html');
        response.write('<html>');
        response.write('<head><title>User Creation</title></head><body>');
        response.write('<h1>Create User</h1>');
        response.write('<h2>Please enter a user name:</h2>');
        response.write('<form action="/create-user" method="POST"><input type="text" name="username"><button type="submit">Send</button></form>');
        response.write('</body></html>');
        response.end();
    },

    _sendUserListPage: function (response) {
        response.setHeader('Content-Type', 'text/html');
        response.write('<html>');
        response.write('<head><title>User List</title></head><body><ul>');
        response.write('<li>User 1</li>');
        response.write('<li>User 2</li>');
        response.write('<li>User 3</li>');
        response.write('<li>User 4</li>');
        response.write('</ul></body></html>');
        response.end();
    },

    _handleUserCreationAndRedirectToUserCreationPage: function (request, response) {
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

        this._writeMessageToConsoleAndRedirect(messageStr, response);
    },

    _writeMessageToConsoleAndRedirect: function (messageStr, response) {
        console.log(messageStr);

        this._redirectToUserCreationPage(response);
    },

    _redirectToUserCreationPage: function (response) {
        response.statusCode = 302;
        response.setHeader('Location', '/');
        response.end();
    },
};

module.exports = routes;