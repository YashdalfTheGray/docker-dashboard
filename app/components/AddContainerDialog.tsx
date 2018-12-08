import * as React from 'react';

import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import TextField from '@material-ui/core/TextField';

interface IAddContainerDialogProps {
  open: boolean;
  onCancel: () => void;
  onSubmit: () => void;
}

interface IAddContainerDialogState {
  imageName: string;
  isValid: boolean;
  isTouched: boolean;
}

class AddContainerDialog extends React.Component<
  IAddContainerDialogProps,
  IAddContainerDialogState
> {
  constructor(props: IAddContainerDialogProps) {
    super(props);

    this.state = {
      imageName: '',
      isTouched: false,
      isValid: false
    };
  }
  public render() {
    const { open, onCancel, onSubmit } = this.props;

    return (
      <Dialog
        open={open}
        onClose={onCancel}
        aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">Run new container</DialogTitle>
        <DialogContent>
          <DialogContentText>
            To subscribe to this website, please enter your email address here.
            We will send updates occasionally.
          </DialogContentText>
          <TextField
            autoFocus={true}
            margin="dense"
            id="imageName"
            label="Image Name"
            fullWidth={true}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={onCancel} color="primary">
            Cancel
          </Button>
          <Button onClick={onSubmit} color="primary">
            Subscribe
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
}
