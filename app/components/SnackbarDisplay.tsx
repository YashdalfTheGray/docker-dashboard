import * as React from 'react';

import Snackbar from '@material-ui/core/Snackbar';

import { events } from '../../common';

import { getSocket } from '../services/socket';

interface ISnackbarDisplayState {
  message: string;
  isVisible: boolean;
}

class SnackbarDisplay extends React.Component<any, ISnackbarDisplayState> {
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
      events.newContainerError
    ].forEach(e => socket.on(e, this.errorListener));
  }

  public componentWillUnmount() {
    const socket = getSocket();

    [
      events.listContainersError,
      events.startContainerError,
      events.stopContainerError,
      events.removeContainerError,
      events.newContainerError
    ].forEach(e => socket.off(e, this.errorListener));
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

  private readonly errorListener: (err: Error) => void = (err: Error) => {
    this.setState({
      message: err.message,
      isVisible: true
    });
  };
}

export default SnackbarDisplay;
