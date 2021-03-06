// tslint:disable:no-console
import { resolve } from 'path';

import chalk from 'chalk';
import express from 'express';
import { createServer } from 'http';
import morgan from 'morgan';
import { Server, Socket } from 'socket.io';

import { events } from '../common';
import docker from './docker-api';
import hotModuleReloadingSetup from './hmr';

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, { serveClient: false });

if (process.env.NODE_ENV === 'development') {
  hotModuleReloadingSetup(app);
}

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

app.get('/', (req, res) =>
  res.sendFile(resolve(__dirname, './public/index.html'))
);

httpServer.listen(port, () => {
  console.log(
    `Server started on ${chalk.green(`http://localhost:${port as string}`)}`
  );
});

io.on('connection', (socket: Socket) => {
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
        new Error('No container by that id')
      );
    }
  });

  socket.on(events.stopContainer, async ({ id }) => {
    socket.emit(events.stopContainerAck);
    const container = docker.getContainer(id);

    if (container) {
      try {
        await container.stop();
        socket.emit(events.stopContainerSuccess);
        await refreshContainers();
      } catch (err) {
        socket.emit(events.stopContainerError, err);
      }
    } else {
      socket.emit(
        events.stopContainerError,
        new Error('No container by that id')
      );
    }
  });

  socket.on(events.removeContainer, async ({ id }) => {
    socket.emit(events.removeContainerAck);
    const container = docker.getContainer(id);

    if (container) {
      try {
        await container.remove();
        socket.emit(events.removeContainerSuccess);
        await refreshContainers();
      } catch (err) {
        socket.emit(events.removeContainerError, err);
      }
    } else {
      socket.emit(
        events.removeContainerError,
        new Error('No container by that id')
      );
    }
  });

  socket.on(events.newContainer, async ({ imageName, name }) => {
    socket.emit(events.newContainerAck);

    try {
      const container = await docker.createContainer({
        Image: imageName,
        name,
      });
      socket.emit(events.newContainerSuccess);
      const data = await container.start();
      socket.emit(events.startContainerSuccess, data);
    } catch (err) {
      socket.emit(events.newContainerError, err);
    }
  });

  socket.on(events.containerLogs, async ({ id, timestamps }) => {
    socket.emit(events.containerLogsAck);

    const container = docker.getContainer(id);

    if (container) {
      try {
        const logsBuffer = await container.logs({
          stdout: true,
          stderr: true,
          timestamps: timestamps && true,
        });

        socket.emit(events.containerLogsSuccess, {
          logs: logsBuffer.toString(),
        });
      } catch (err) {
        console.log(err);
        socket.emit(events.containerLogsError, err);
      }
    } else {
      socket.emit(
        events.containerLogsError,
        new Error('No container by that id')
      );
    }
  });
});
