// tslint:disable:no-console

import chalk from 'chalk';
import * as express from 'express';
import { Server } from 'http';
import * as morgan from 'morgan';
import * as socketIo from 'socket.io';

import docker from './docker-api';
import * as events from './socket-events';

const app = express();
const server = new Server(app);
const io = socketIo(server);

const port = process.env.PORT || process.argv[2] || 3000;

async function refreshContainers() {
  try {
    const containers = await docker.listContainers({ all: true });
    io.emit(events.listContainersSuccess, containers);
  } catch (err) {
    io.emit(events.listContainersError, err);
  }
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

  socket.on(events.listContainers, async () => {
    socket.emit(events.listContainersAck);
    await refreshContainers();
  });

  socket.on(events.startContainer, async ({ id }) => {
    socket.emit(events.startContainerAck);
    const container = docker.getContainer(id);

    if (container) {
      try {
        await container.start();
        socket.emit(events.startContainerSuccess);
        await refreshContainers();
      } catch (err) {
        socket.emit(events.startContainerError, err);
      }
    } else {
      socket.emit(
        events.startContainerError,
        new Error('No container by that name')
      );
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
