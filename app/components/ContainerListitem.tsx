import * as React from 'react';
import { Card, CardActions, CardTitle, CardText } from 'material-ui/Card';
import FlatButton from 'material-ui/FlatButton';

export interface Container {
    id: string,
    name: string,
    image: string,
    state: string,
    status: string
}

export default class ContainerListItem extends React.Component<Container, {}> {
    isRunning() {
        return this.props.state === 'running';
    }

    render() {
        return (
            <Card>
                <CardTitle
                    title={this.props.name}
                    titleColor={ this.isRunning() ? '#00E676' : '#90A4AE'}/>
                <CardText>
                    <p>Name: {this.props.name}</p>
                    <p>Image: <code>{this.props.image}</code></p>
                    <p>Status: {this.props.status}</p>
                </CardText>
                <CardActions>
                    <FlatButton label={ this.isRunning() ? 'Stop' : 'Start' }></FlatButton>
                </CardActions>
            </Card>
        );
    }
}
