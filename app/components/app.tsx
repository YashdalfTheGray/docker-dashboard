import * as io from 'socket.io-client';
import * as React from 'react';
import AppBar from 'material-ui/AppBar';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import IconButton from 'material-ui/IconButton';
import { chain, partition } from 'lodash';

import ContainerListItem, { Container } from './ContainerListitem';
import ContainerList from './ContainerList';
import { getSocket } from '../services/socket';

class AppState {
    containers?: Container[];
    stoppedContainers?: Container[];
}

const socket = getSocket();

export class AppComponent extends React.Component<{}, AppState> {

    constructor() {
        super();

        this.state = {
            containers: [],
            stoppedContainers: []
        };

        socket.on('containers.list', (containers: any) => {
            const partitioned = partition(containers, (c: any) => c.State === 'running');

            this.setState({
                containers: partitioned[0].map(this.mapContainer),
                stoppedContainers: partitioned[1].map(this.mapContainer)
            });
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

    componentDidMount() {
        socket.emit('containers.list');
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

        return (
            <MuiThemeProvider>
                <div>
                    <AppBar
                        title="Docker Dashboard"
                        showMenuIconButton={false}
                        iconElementRight={newContainerButton}/>
                    <ContainerList title="Running" containers={this.state.containers}></ContainerList>
                    <ContainerList title="Stopped" containers={this.state.stoppedContainers}></ContainerList>
                </div>
            </MuiThemeProvider>
        );
    }
}
