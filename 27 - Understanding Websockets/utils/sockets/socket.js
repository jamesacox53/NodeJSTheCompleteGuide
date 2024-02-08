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

exports.initialize = initialize;
exports.getIO = getIO;