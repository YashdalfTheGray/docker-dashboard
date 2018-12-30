import * as React from 'react';

import { chain, partition } from 'lodash';

import AppBar from '@material-ui/core/AppBar';
import Button from '@material-ui/core/Button';
import { Theme } from '@material-ui/core/styles/createMuiTheme';
import createStyles from '@material-ui/core/styles/createStyles';
import withStyles, { WithStyles } from '@material-ui/core/styles/withStyles';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import AddIcon from '@material-ui/icons/Add';

import { events } from '../../common';

import { getSocket } from '../services/socket';
import { Container } from '../types/Container';

import RunContainerDialog, { IRunDialogFormValues } from './AddContainerDialog';
import ContainerList from './ContainerList';

interface IAppState {
  containers?: Container[];
  stoppedContainers?: Container[];
  runContainerModalOpen?: boolean;
  imageName?: string;
  isImageNameValid?: boolean;
}

const appComponentStyles = (theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1
    },
    grow: {
      flexGrow: 1
    },
    appFrame: {
      marginTop: '72px'
    },
    button: {
      margin: theme.spacing.unit
    },
    fab: {
      position: 'fixed',
      bottom: theme.spacing.unit * 2,
      right: theme.spacing.unit * 2
    }
  });

type AppComponentProps = WithStyles<typeof appComponentStyles>;

class AppComponent extends React.Component<AppComponentProps, IAppState> {
  constructor(props: AppComponentProps) {
    super(props);

    this.state = {
      containers: [],
      stoppedContainers: [],
      runContainerModalOpen: false,
      imageName: '',
      isImageNameValid: false
    };
  }

  public componentDidMount() {
    const socket = getSocket();
    socket.on(events.listContainersSuccess, (containers: any) => {
      const partitioned = partition(
        containers,
        (c: any) => c.State === 'running'
      );

      this.setState({
        containers: partitioned[0].map(this.mapContainer),
        stoppedContainers: partitioned[1].map(this.mapContainer)
      });
    });

    // tslint:disable:no-console
    socket.on(events.listContainersError, (err: Error) => {
      console.error(err);
    });
    socket.on(events.startContainerError, (err: Error) => {
      console.error(err);
    });
    socket.on(events.stopContainerError, (err: Error) => {
      console.error(err);
    });
    socket.on(events.removeContainerError, (err: Error) => {
      console.error(err);
    });
    socket.on(events.newContainerError, (err: Error) => {
      console.error(err);
    });
    // tslint:enable:no-console

    socket.emit(events.listContainers);
  }

  public handleNewContainerModalOpen = () => {
    this.setState({
      runContainerModalOpen: true
    });
  };

  public handleNewContainerModalClose = () => {
    this.setState({
      runContainerModalOpen: false
    });
  };

  public handleRunContainer = ({ imageName, name }: IRunDialogFormValues) => {
    const socket = getSocket();
    socket.emit(events.newContainer, { imageName, name });
    this.handleNewContainerModalClose();
  };

  public handleImageNameChange = ({
    currentTarget: { value }
  }: React.FormEvent<HTMLInputElement>) => {
    this.setState({
      imageName: value,
      isImageNameValid: value.length > 0
    });
  };

  public mapContainer = (container: any): Container => {
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
  };

  public render() {
    const { classes } = this.props;
    const { runContainerModalOpen } = this.state;

    return (
      <div className={classes.root}>
        <AppBar>
          <Toolbar>
            <Typography variant="h6" color="inherit" className={classes.grow}>
              Docker Dashboard
            </Typography>
          </Toolbar>
        </AppBar>
        <div className={classes.appFrame}>
          <ContainerList
            title="Running"
            containers={this.state.containers || []}
          />
          <ContainerList
            title="Stopped"
            containers={this.state.stoppedContainers || []}
          />
        </div>
        <Button
          variant="fab"
          className={classes.fab}
          color="secondary"
          onClick={this.handleNewContainerModalOpen}>
          <AddIcon />
        </Button>
        <RunContainerDialog
          open={runContainerModalOpen || false}
          onCancel={this.handleNewContainerModalClose}
          onSubmit={this.handleRunContainer}
        />
      </div>
    );
  }
}

export default withStyles(appComponentStyles)(AppComponent);
