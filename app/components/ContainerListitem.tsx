import * as React from 'react';
import { Card, CardActions, CardTitle, CardText } from 'material-ui/Card';
import FlatButton from 'material-ui/FlatButton';

import { getSocket } from '../services/socket';

export interface Container {
  id: string;
  name: string;
  image: string;
  state: string;
  status: string;
}

interface IContainerListItemProps {
  container: Container;
}

const socket = getSocket();

export default class ContainerListItem extends React.Component<
  IContainerListItemProps
> {
  public isRunning = () => {
    const { container } = this.props;
    return container.state === 'running';
  };

  public handleStartStopClick = () => {
    const { container } = this.props;
    socket.emit(this.isRunning() ? 'container.stop' : 'container.start', {
      id: container.id
    });
  };

  public handleDeleteClick = () => {
    const { container } = this.props;
    socket.emit('container.remove', { id: container.id });
  };

  render() {
    const { container } = this.props;
    return (
      <Card style={{ margin: '8px 0px' }}>
        <CardTitle
          title={container.name}
          titleColor={this.isRunning() ? '#00E676' : '#90A4AE'}
        />
        <CardText>
          <p>Name: {container.name}</p>
          <p>
            Image: <code>{container.image}</code>
          </p>
          <p>Status: {container.status}</p>
        </CardText>
        <CardActions>
          <FlatButton
            label={this.isRunning() ? 'Stop' : 'Start'}
            onClick={this.handleStartStopClick}
          />
          <FlatButton label="Remove" onClick={this.handleDeleteClick} />
        </CardActions>
      </Card>
    );
  }
}
