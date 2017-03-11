const express = require('express');
const morgan = require('morgan');
const path = require('path');
const chalk = require('chalk');
const socketIo = require('socket.io');
const Server = require('http').Server;

const docker = require('./dockerapi');

const app = express();
const server = Server(app);
const io = socketIo(server);

const port = process.env.PORT || process.argv[2] || 3000;

function refreshContainers() {
    docker.listContainers({ all: true }, (err, containers) => {
        io.emit('containers.list', containers);
    });
}

app.use(morgan('dev'));
app.use(express.static('public'));

server.listen(port, () => {
    console.log(`Server started on ${chalk.green(port)}`);
});

io.on('connection', socket => {
    socket.on('containers.list', () => {
        refreshContainers();
    });
});
