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
import Typography from '@material-ui/core/Typography';
import DeleteIcon from '@material-ui/icons/Delete';
import ListAltIcon from '@material-ui/icons/ListAlt';
import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import StopIcon from '@material-ui/icons/Stop';

import { events } from '../../common';

import { getSocket } from '../services/socket';
import { IContainer } from '../types/Container';
import AlertButton from './AlertButton';

interface IContainerListItemProps {
  container: IContainer;
}

const containerListItemStyles = (theme: Theme) =>
  createStyles({
    chip: {
      margin: theme.spacing()
    },
    titleRow: {
      display: 'flex',
      justifyContent: 'flex-start',
      alignItems: 'center'
    },
    codeBit: {
      fontSize: '1.125rem'
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
    socket.emit(
      this.isRunning() ? events.stopContainer : events.startContainer,
      {
        id: container.id
      }
    );
  };

  public handleDeleteClick = () => {
    const { container } = this.props;
    socket.emit(events.removeContainer, { id: container.id });
  };

  public handleLogsClick = () => {
    const { container } = this.props;
    socket.emit(events.containerLogs, { id: container.id });
  };

  public render() {
    const { classes, container } = this.props;
    return (
      <Card style={{ margin: '8px 0px' }}>
        <CardHeader
          title={
            <span className={classes.titleRow}>
              <Typography variant="h5" component="h2">
                {container.name}
              </Typography>
              {this.isRunning() ? (
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
              )}
            </span>
          }
        />
        <CardContent>
          <Typography variant="body2">
            Image: <code className={classes.codeBit}>{container.image}</code>
          </Typography>
          <Typography variant="body2">Status: {container.status}</Typography>
        </CardContent>
        <CardActions>
          <Button
            onClick={this.handleStartStopClick}
            color="primary"
            startIcon={this.isRunning() ? <StopIcon /> : <PlayArrowIcon />}>
            {this.isRunning() ? 'Stop' : 'Start'}
          </Button>
          <Button onClick={this.handleLogsClick} startIcon={<ListAltIcon />}>
            Logs
          </Button>
          <AlertButton
            onClick={this.handleDeleteClick}
            startIcon={<DeleteIcon />}>
            Remove
          </AlertButton>
        </CardActions>
      </Card>
    );
  }
}

export default withStyles(containerListItemStyles)(ContainerListItem);
