const socketIO = require('socket.io');

function addSocket(server) {
    const io = socketIO(server);

    io.on('connection', socket => _onConnection(socket));
}

function _onConnection(socket) {
    console.log('Client connected');
}

exports.addSocket = addSocket;