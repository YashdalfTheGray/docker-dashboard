import * as io from 'socket.io-client';

let socket: typeof io.Socket;

function getSocket(url?: string) {
    if (!socket) {
        socket = io.connect(url);
    }
    return socket;
}

export {
    getSocket
};
