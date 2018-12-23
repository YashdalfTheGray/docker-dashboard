// tslint:disable:no-console

import chalk from 'chalk';
import * as express from 'express';
import { Server } from 'http';
import * as morgan from 'morgan';
import * as socketIo from 'socket.io';

import docker from './docker-api';

const app = express();
const server = new Server(app);
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
  console.log(`Server started on ${chalk.green(port as string)}`);
});

io.on('connection', socket => {
  const refreshContainersInterval = setInterval(refreshContainers, 2000);

  socket.on('disconnect', () => {
    console.log('client disconnected');
    clearInterval(refreshContainersInterval);
  });

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
        container.start((startErr, data) => {
          if (startErr) {
            socket.emit('container.error', { message: startErr });
          } else {
            socket.emit('container.started', data);
          }
        });
      } else {
        socket.emit('container.error', { message: err });
      }
    });
  });
});
