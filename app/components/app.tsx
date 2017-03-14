import * as io from 'socket.io-client';
import * as React from 'react';
import AppBar from 'material-ui/AppBar';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import IconButton from 'material-ui/IconButton';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import TextField from 'material-ui/TextField';
import { chain, partition } from 'lodash';

import ContainerListItem, { Container } from './ContainerListitem';
import ContainerList from './ContainerList';
import { getSocket } from '../services/socket';

class AppState {
    containers?: Container[];
    stoppedContainers?: Container[];
    newContainerModalOpen?: boolean;
    imageName?: string;
}

const socket = getSocket();

export class AppComponent extends React.Component<{}, AppState> {

    constructor() {
        super();

        this.state = {
            containers: [],
            stoppedContainers: [],
            newContainerModalOpen: false,
            imageName: ''
        };

        this.handleNewContainerModalOpen = this.handleNewContainerModalOpen.bind(this);
        this.handleNewContainerModalClose = this.handleNewContainerModalClose.bind(this);
        this.handleRunContainer = this.handleRunContainer.bind(this);
        this.handleImageNameChange = this.handleImageNameChange.bind(this);

        socket.on('containers.list', (containers: any) => {
            const partitioned = partition(containers, (c: any) => c.State === 'running');

            this.setState({
                containers: partitioned[0].map(this.mapContainer),
                stoppedContainers: partitioned[1].map(this.mapContainer)
            });
        });
    }

    componentDidMount() {
        socket.emit('containers.list');
    }

    handleNewContainerModalOpen() {
        this.setState({
            newContainerModalOpen: true
        });
    }

    handleNewContainerModalClose() {
        this.setState({
            newContainerModalOpen: false
        });
    }

    handleRunContainer() {
        console.log(`Attempting to run a new container with the ${this.state.imageName} image.`);
        this.handleNewContainerModalClose();
    }

    handleImageNameChange(event: React.FormEvent<HTMLInputElement>) {
        this.setState({
            imageName: event.currentTarget.value
        });
    }

    mapContainer(container: any): Container {
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
    }

    render() {
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
                onTouchTap={this.handleNewContainerModalClose} />,
            <FlatButton
                label="Run"
                primary={true}
                onTouchTap={this.handleRunContainer} />
        ];

        return (
            <MuiThemeProvider>
                <div>
                    <AppBar
                        title="Docker Dashboard"
                        showMenuIconButton={false}
                        iconElementRight={newContainerButton}
                        onRightIconButtonTouchTap={this.handleNewContainerModalOpen} />
                    <ContainerList title="Running" containers={this.state.containers}></ContainerList>
                    <ContainerList title="Stopped" containers={this.state.stoppedContainers}></ContainerList>
                    <Dialog
                        title="Create a new container"
                        actions={newContainerModalActions}
                        modal={true}
                        open={this.state.newContainerModalOpen}>
                        <TextField
                            floatingLabelText="Image name"
                            fullWidth={true}
                            value={this.state.imageName}
                            onChange={this.handleImageNameChange} />
                    </Dialog>
                </div>
            </MuiThemeProvider>
        );
    }
}
