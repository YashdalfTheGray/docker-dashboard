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
                <CardTitle title={this.props.name}></CardTitle>
                <CardText>This is some text text to put in the card</CardText>
                <CardActions>
                    <FlatButton label="Action"></FlatButton>
                    <FlatButton label="Action"></FlatButton>
                </CardActions>
            </Card>
        );
    }
}
