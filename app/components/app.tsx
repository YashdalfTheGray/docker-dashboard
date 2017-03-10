import * as React from 'react';
import AppBar from 'material-ui/AppBar';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import IconButton from 'material-ui/IconButton';
import { partition } from 'lodash';

import ContainerListItem, { Container } from './ContainerListitem';
import ContainerList from './ContainerList';

class AppState {
    containers?: Container[];
    stoppedContainers?: Container[];
}

export class AppComponent extends React.Component<{}, AppState> {
    containers: Container[] = [
        {
            id: '1',
            name: 'Test Container',
            image: 'httpd',
            state: 'running',
            status: 'Running'
        },
        {
            id: '2',
            name: 'Test Container 2',
            image: 'node',
            state: 'stopped',
            status: 'Running'
        }
    ]

    constructor() {
        super();

        const partitioned = partition(this.containers, c => c.state === 'running');

        this.state = {
            containers: partitioned[0],
            stoppedContainers: partitioned[1]
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
