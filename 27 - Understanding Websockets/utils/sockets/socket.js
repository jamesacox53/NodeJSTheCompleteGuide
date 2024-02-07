let io;

function initialize(server) {
    io = require('socket.io')(server);

    return io;
}

function getIO() {
    if (!io)
        throw new Error("Socket.io hasn't been initialized");

    return io;
}

function addSocket() {
    io.on('connection', socket => _onConnection(socket));
}

function _onConnection(socket) {
    console.log('Client connected');
}

exports.initialize = initialize;
exports.getIO = getIO;
exports.addSocket = addSocket;