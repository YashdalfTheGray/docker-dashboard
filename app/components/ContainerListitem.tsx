import * as React from 'react';

import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import Chip from '@material-ui/core/Chip';
import blueGrey from '@material-ui/core/colors/blueGrey';
import green from '@material-ui/core/colors/green';
import { Theme } from '@material-ui/core/styles/createMuiTheme';
import createStyles from '@material-ui/core/styles/createStyles';
import withStyles, { WithStyles } from '@material-ui/core/styles/withStyles';

import { getSocket } from '../services/socket';
import { Container } from '../types/Container';

interface IContainerListItemProps {
  container: Container;
}

const containerListItemStyles = (theme: Theme) =>
  createStyles({
    chip: {
      margin: theme.spacing.unit
    }
  });

type ContainerListItemProps = IContainerListItemProps &
  WithStyles<typeof containerListItemStyles>;

const socket = getSocket();

class ContainerListItem extends React.Component<ContainerListItemProps> {
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

  public render() {
    const { classes, container } = this.props;
    return (
      <Card style={{ margin: '8px 0px' }}>
        <CardHeader
          title={container.name}
          subheader={
            this.isRunning() ? (
              <Chip
                label="Running"
                className={classes.chip}
                classes={{ colorPrimary: green.A400 }}
              />
            ) : (
              <Chip
                label="Stopped"
                className={classes.chip}
                classes={{ colorPrimary: blueGrey[300] }}
              />
            )
          }
        />
        <CardContent>
          <p>Name: {container.name}</p>
          <p>
            Image: <code>{container.image}</code>
          </p>
          <p>Status: {container.status}</p>
        </CardContent>
        <CardActions>
          <Button onClick={this.handleStartStopClick} color="primary">
            {this.isRunning() ? 'Stop' : 'Start'}
          </Button>
          <Button onClick={this.handleDeleteClick}>Remove</Button>
        </CardActions>
      </Card>
    );
  }
}

export default withStyles(containerListItemStyles)(ContainerListItem);
