import * as React from 'react';

import AppBar from '@material-ui/core/AppBar';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormGroup from '@material-ui/core/FormGroup';
import FormLabel from '@material-ui/core/FormLabel';
import IconButton from '@material-ui/core/IconButton';
import Slide, { SlideProps } from '@material-ui/core/Slide';
import { Theme } from '@material-ui/core/styles/createMuiTheme';
import createStyles from '@material-ui/core/styles/createStyles';
import withStyles, { WithStyles } from '@material-ui/core/styles/withStyles';
import Switch from '@material-ui/core/Switch';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import CloseIcon from '@material-ui/icons/Close';

import { IContainer } from '../types/Container';

const Transition = React.forwardRef<unknown, SlideProps>(
  function TransitionComponent(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
  }
);

const logsDialogStyles = (theme: Theme) =>
  createStyles({
    root: {
      backgroundColor: theme.palette.background.paper
    },
    appBar: {
      position: 'relative'
    },
    title: {
      marginLeft: theme.spacing(2),
      flex: 1
    },
    logsDisplay: {
      marginTop: '16px',
      display: 'flex',
      flexDirection: 'column'
    },
    options: {
      marginTop: '16px'
    }
  });

interface ILogsDialogProps {
  container: IContainer;
  onClose: () => void;
  isOpen: boolean;
  logsString: string;
}

type LogsDialogProps = ILogsDialogProps & WithStyles<typeof logsDialogStyles>;

interface ILogDialogState {
  timestampsEnabled: boolean;
}

class LogsDialog extends React.Component<LogsDialogProps, ILogDialogState> {
  constructor(props: LogsDialogProps) {
    super(props);

    this.state = {
      timestampsEnabled: true
    };
  }

  public handleTimestampsEnabledChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    this.setState({ timestampsEnabled: event.target.checked });
  };

  public render() {
    const { container, onClose, isOpen, logsString, classes } = this.props;
    const { timestampsEnabled } = this.state;

    return (
      <Dialog
        fullScreen={true}
        TransitionComponent={Transition}
        onClose={onClose}
        aria-labelledby="simple-dialog-title"
        open={isOpen}>
        <AppBar className={classes.appBar}>
          <Toolbar>
            <Typography variant="h6" className={classes.title}>
              Logs for <code>{container.name}</code>
            </Typography>
            <IconButton color="inherit" onClick={onClose} aria-label="close">
              <CloseIcon />
            </IconButton>
          </Toolbar>
        </AppBar>
        <DialogContent>
          <FormControl component="fieldset" className={classes.options}>
            <FormLabel component="legend">Options</FormLabel>
            <FormGroup row={true}>
              <FormControlLabel
                control={
                  <Switch
                    checked={timestampsEnabled}
                    onChange={this.handleTimestampsEnabledChange}
                    value="timestampsEnabled"
                  />
                }
                label="Timestamps"
              />
            </FormGroup>
          </FormControl>
          <DialogContentText className={classes.logsDisplay}>
            {logsString.split('\n').map((line, i) => (
              <code key={`logline-${i}`}>{line}</code>
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
