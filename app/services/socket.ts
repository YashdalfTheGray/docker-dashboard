import io from 'socket.io-client';

let socket: typeof io.Socket;

function getSocket() {
  if (!socket) {
    socket = io();
  }
  return socket;
}

export { getSocket };
