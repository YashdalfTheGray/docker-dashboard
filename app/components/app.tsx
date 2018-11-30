import * as React from 'react';

import { chain, partition } from 'lodash';

import AppBar from 'material-ui/AppBar';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import IconButton from 'material-ui/IconButton';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import TextField from 'material-ui/TextField';

import ContainerListItem, { Container } from './ContainerListitem';
import ContainerList from './ContainerList';
import { getSocket } from '../services/socket';

interface IAppState {
  containers?: Container[];
  stoppedContainers?: Container[];
  newContainerModalOpen?: boolean;
  imageName?: string;
  isImageNameValid?: boolean;
}

const socket = getSocket();

export class AppComponent extends React.Component<{}, IAppState> {
  constructor(props: {}) {
    super(props);

    this.state = {
      containers: [],
      stoppedContainers: [],
      newContainerModalOpen: false,
      imageName: '',
      isImageNameValid: false
    };
  }

  public componentDidMount() {
    socket.on('containers.list', (containers: any) => {
      const partitioned = partition(
        containers,
        (c: any) => c.State === 'running'
      );

      this.setState({
        containers: partitioned[0].map(this.mapContainer),
        stoppedContainers: partitioned[1].map(this.mapContainer)
      });
    });

    socket.on('container.error', ({ message }: any) => {
      console.error(message);
    });

    socket.on('container.started', () => {
      this.setState({
        imageName: '',
        isImageNameValid: false
      });
    });

    socket.emit('containers.list');
  }

  public handleNewContainerModalOpen = () => {
    this.setState({
      newContainerModalOpen: true
    });
  };

  public handleNewContainerModalClose = () => {
    this.setState({
      newContainerModalOpen: false
    });
  };

  public handleRunContainer = () => {
    socket.emit('container.new', { name: this.state.imageName });
    this.handleNewContainerModalClose();
  };

  public handleImageNameChange = ({
    currentTarget: { value }
  }: React.FormEvent<HTMLInputElement>) => {
    this.setState({
      imageName: value,
      isImageNameValid: value.length > 0
    });
  };

  public mapContainer = (container: any): Container => {
    return {
      id: container.Id,
      name: chain(container.Names)
        .map((n: string) => n.substr(1))
        .join(', ')
        .value(),
      state: container.State,
      status: `${container.State} (${container.Status})`,
      image: container.Image
    };
  };

  public render() {
    const newContainerButton = (
      <IconButton
        iconClassName="material-icons"
        tooltip="New container"
        style={{ marginRight: '8px' }}>
        add
      </IconButton>
    );

    const newContainerModalActions = [
      <FlatButton
        label="Close"
        primary={false}
        onClick={this.handleNewContainerModalClose}
      />,
      <FlatButton
        label="Run"
        primary={true}
        disabled={!this.state.isImageNameValid}
        onClick={this.handleRunContainer}
      />
    ];

    return (
      <MuiThemeProvider>
        <div>
          <AppBar
            title="Docker Dashboard"
            showMenuIconButton={false}
            iconElementRight={newContainerButton}
            onRightIconButtonTouchTap={this.handleNewContainerModalOpen}
          />
          <ContainerList title="Running" containers={this.state.containers} />
          <ContainerList
            title="Stopped"
            containers={this.state.stoppedContainers}
          />
          <Dialog
            title="Create a new container"
            actions={newContainerModalActions}
            modal={true}
            open={this.state.newContainerModalOpen}>
            <TextField
              autoFocus
              floatingLabelText="Image name"
              fullWidth={true}
              value={this.state.imageName}
              onChange={this.handleImageNameChange}
            />
          </Dialog>
        </div>
      </MuiThemeProvider>
    );
  }
}
