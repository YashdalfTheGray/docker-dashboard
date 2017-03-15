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
    const refreshContainersInterval = setInterval(refreshContainers, 2000);

    socket.on('disconnect', () => {
        console.log('client disconnected');
        clearInterval(refreshContainersInterval);
    })

    socket.on('containers.list', () => {
        refreshContainers();
    });

    socket.on('container.start', ({ id }) => {
        const container = docker.getContainer(id);

        if (container) {
            container.start((err, data) => refreshContainers);
        }
    });

    socket.on('container.stop', ({ id }) => {
        const container = docker.getContainer(id);

        if (container) {
            container.stop((err, data) => refreshContainers);
        }
    });

    socket.on('container.remove', ({ id }) => {
        const container = docker.getContainer(id);

        if (container) {
            container.remove((err, data) => refreshContainers);
        }
    });

    socket.on('container.new', ({ name }) => {
        docker.createContainer({ Image: name }, (err, container) => {
            if (!err) {
                socket.emit('container.created', container);
                container.start((err, data) => {
                    if (err) {
                        socket.emit('container.error', { message: err })
                    }
                    else {
                        socket.emit('container.started', data);
                    }
                });
            }
            else {
                socket.emit('container.error', { message: err });
            }
        });
    })
});
