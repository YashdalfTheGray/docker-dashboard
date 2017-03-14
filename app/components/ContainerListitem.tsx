import * as io from 'socket.io-client';
import * as React from 'react';
import { Card, CardActions, CardTitle, CardText } from 'material-ui/Card';
import FlatButton from 'material-ui/FlatButton';

import { getSocket } from '../services/socket';

export interface Container {
    id: string,
    name: string,
    image: string,
    state: string,
    status: string
}

const socket = getSocket();

export default class ContainerListItem extends React.Component<Container, {}> {
    constructor() {
        super();

        this.handleStartStopClick = this.handleStartStopClick.bind(this);
    }
    isRunning() {
        return this.props.state === 'running';
    }

    handleStartStopClick() {
        socket.emit(this.isRunning() ? 'container.stop' : 'container.start', { id: this.props.id });
    }

    render() {
        return (
            <Card style={{ margin: '8px 0px' }}>
                <CardTitle
                    title={this.props.name}
                    titleColor={ this.isRunning() ? '#00E676' : '#90A4AE'}/>
                <CardText>
                    <p>Name: {this.props.name}</p>
                    <p>Image: <code>{this.props.image}</code></p>
                    <p>Status: {this.props.status}</p>
                </CardText>
                <CardActions>
                    <FlatButton
                        label={ this.isRunning() ? 'Stop' : 'Start' }
                        onClick={this.handleStartStopClick}/>
                </CardActions>
            </Card>
        );
    }
}
