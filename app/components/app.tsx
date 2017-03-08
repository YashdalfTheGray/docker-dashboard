import * as React from 'react';
import AppBar from 'material-ui/AppBar';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import IconButton from 'material-ui/IconButton';

export class AppComponent extends React.Component<{}, {}> {
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
                <AppBar
                    title="Docker Dashboard"
                    showMenuIconButton={false}
                    iconElementRight={newContainerButton}/>
            </MuiThemeProvider>
        );
    }
}
