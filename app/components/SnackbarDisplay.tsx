import * as React from 'react';

import Snackbar from '@material-ui/core/Snackbar';

import { events } from '../../common';

import { getSocket } from '../services/socket';

interface ISnackbarDisplayState {
  message: string | undefined;
  isVisible: boolean;
}

class SnackbarDisplay extends React.Component<any, ISnackbarDisplayState> {
  private messageQueue: string[] = [];

  constructor(props: any) {
    super(props);
    this.state = {
      message: '',
      isVisible: false
    };
  }

  public componentDidMount() {
    const socket = getSocket();

    [
      events.listContainersError,
      events.startContainerError,
      events.stopContainerError,
      events.removeContainerError,
      events.newContainerError,
      events.containerLogsError
    ].forEach(e => socket.on(e, this.errorListener));

    socket.on(
      events.listContainersAck,
      this.ackListener('Refreshing container list...')
    );

    socket.on(
      events.startContainerAck,
      this.ackListener('Attempting to start container')
    );
    socket.on(
      events.stopContainerAck,
      this.ackListener('Attempting to stop container')
    );
  }

  public componentDidUpdate(prevProps: any, prevState: ISnackbarDisplayState) {
    const { isVisible } = this.state;
    const { isVisible: prevVisible } = prevState;

    if (prevVisible && !isVisible && this.messageQueue.length > 0) {
      this.setState({
        message: this.messageQueue.shift(),
        isVisible: true
      });
    }
  }

  public componentWillUnmount() {
    const socket = getSocket();

    [
      events.listContainersError,
      events.startContainerError,
      events.stopContainerError,
      events.removeContainerError,
      events.newContainerError,
      events.containerLogsError
    ].forEach(e => socket.off(e, this.errorListener));

    socket.off(
      events.listContainersAck,
      this.ackListener('Refreshing container list...')
    );

    socket.off(
      events.startContainerAck,
      this.ackListener('Attempting to start container')
    );
    socket.off(
      events.stopContainerAck,
      this.ackListener('Attempting to stop container')
    );
    socket.off(events.containerLogsAck, null);
  }

  public handleSnackbarClose = () => {
    this.setState({
      isVisible: false
    });
  };

  public render() {
    const { message, isVisible } = this.state;
    return (
      <Snackbar
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left'
        }}
        open={isVisible}
        autoHideDuration={3000}
        onClose={this.handleSnackbarClose}
        ContentProps={{
          'aria-describedby': 'snackbar-message'
        }}
        message={<span id="snackbar-message">{message}</span>}
      />
    );
  }

  private readonly errorListener = (err: Error) => {
    this.showMessageProperly(err.message);
  };

  private readonly ackListener = (message: string) => () => {
    this.showMessageProperly(message);
  };

  private showMessageProperly = (message: string) => {
    // Material Design says that we have to hide the snackbar
    // if a new message comes in and then re-show it
    const { isVisible } = this.state;

    if (!isVisible) {
      this.setState({
        message,
        isVisible: true
      });
    } else {
      this.messageQueue.push(message);
      this.setState({
        isVisible: false
      });
    }
  };
}

export default SnackbarDisplay;
