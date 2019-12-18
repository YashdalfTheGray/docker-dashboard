import * as React from 'react';

import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import { Theme } from '@material-ui/core/styles/createMuiTheme';
import createStyles from '@material-ui/core/styles/createStyles';
import withStyles, { WithStyles } from '@material-ui/core/styles/withStyles';

import { IContainer } from '../types/Container';

const logsDialogStyles = (theme: Theme) =>
  createStyles({
    root: {
      backgroundColor: theme.palette.background.paper
    }
  });

interface ILogsDialogProps {
  container: IContainer;
  onClose: () => void;
  isOpen: boolean;
}

type LogsDialogProps = ILogsDialogProps & WithStyles<typeof logsDialogStyles>;

class LogsDialog extends React.Component<LogsDialogProps> {
  public render() {
    const { container, onClose, isOpen } = this.props;

    return (
      <Dialog
        onClose={onClose}
        aria-labelledby="simple-dialog-title"
        open={isOpen}>
        <DialogTitle id="simple-dialog-title">
          Logs for {container.name}
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            {['some code here', 'some more code here'].map((l, i) => (
              <pre key={`logline-${i}`}>{l}</pre>
            ))}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Close</Button>
        </DialogActions>
      </Dialog>
    );
  }
}

export default withStyles(logsDialogStyles)(LogsDialog);
