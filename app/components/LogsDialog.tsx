import * as React from 'react';

import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import { Theme } from '@material-ui/core/styles/createMuiTheme';
import createStyles from '@material-ui/core/styles/createStyles';
import withStyles, { WithStyles } from '@material-ui/core/styles/withStyles';
import Typography from '@material-ui/core/Typography';

const logsDialogStyles = (theme: Theme) =>
  createStyles({
    root: {
      backgroundColor: theme.palette.background.paper
    }
  });

interface ILogsDialogProps {
  onClose: () => void;
  isOpen: boolean;
}

type LogsDialogProps = WithStyles<typeof logsDialogStyles> & ILogsDialogProps;

class LogsDialog extends React.Component<LogsDialogProps> {
  public render() {
    const { onClose, isOpen } = this.props;

    return (
      <Dialog
        onClose={onClose}
        aria-labelledby="simple-dialog-title"
        open={isOpen}>
        <DialogTitle id="simple-dialog-title">Set backup account</DialogTitle>
      </Dialog>
    );
  }
}

export default withStyles;
