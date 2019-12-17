import * as React from 'react';

import { chain, partition } from 'lodash';
import { hot } from 'react-hot-loader/root';

import AppBar from '@material-ui/core/AppBar';
import Fab from '@material-ui/core/Fab';
import { Theme } from '@material-ui/core/styles/createMuiTheme';
import createStyles from '@material-ui/core/styles/createStyles';
import withStyles, { WithStyles } from '@material-ui/core/styles/withStyles';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import AddIcon from '@material-ui/icons/Add';

import { events } from '../../common';

import { getSocket } from '../services/socket';
import { IContainer } from '../types/Container';

import ContainerList from './ContainerList';
import RunContainerDialog, { IRunDialogFormValues } from './RunContainerDialog';
import SnackbarDisplay from './SnackbarDisplay';

interface IAppState {
  containers?: IContainer[];
  stoppedContainers?: IContainer[];
  runContainerModalOpen?: boolean;
  imageName?: string;
  isImageNameValid?: boolean;
  isLogsDialogOpen?: boolean;
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
      margin: theme.spacing()
    },
    fab: {
      position: 'fixed',
      bottom: theme.spacing(2),
      right: theme.spacing(2)
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
      isImageNameValid: false,
      isLogsDialogOpen: false
    };
  }

  public componentDidMount() {
    const socket = getSocket();
    socket.on(events.listContainersSuccess, this.listContainerListener);

    socket.emit(events.listContainers);
  }

  public componentWillUnmount() {
    const socket = getSocket();

    socket.off(events.listContainersSuccess, this.listContainerListener);
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

  public handleLogsDialogOpen = (container: IContainer) => {
    this.setState({
      isLogsDialogOpen: true
    });
  };

  public mapContainer = (container: any): IContainer => {
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
      <>
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
              openLogsDialog={this.handleLogsDialogOpen}
            />
            <ContainerList
              title="Stopped"
              containers={this.state.stoppedContainers || []}
              openLogsDialog={this.handleLogsDialogOpen}
            />
          </div>
          <Fab
            className={classes.fab}
            color="secondary"
            onClick={this.handleNewContainerModalOpen}>
            <AddIcon />
          </Fab>
          <RunContainerDialog
            open={runContainerModalOpen || false}
            onCancel={this.handleNewContainerModalClose}
            onSubmit={this.handleRunContainer}
          />
        </div>
        <SnackbarDisplay />
      </>
    );
  }

  private listContainerListener = (containers: any) => {
    const partitioned = partition(
      containers,
      (c: any) => c.State === 'running'
    );

    this.setState({
      containers: partitioned[0].map(this.mapContainer),
      stoppedContainers: partitioned[1].map(this.mapContainer)
    });
  };
}

export default hot(withStyles(appComponentStyles)(AppComponent));
