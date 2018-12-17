import * as React from 'react';

import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import TextField from '@material-ui/core/TextField';

import { Field, FieldProps, Formik, FormikProps } from 'formik';
import { object, string } from 'yup';

export interface IAddDialogFormInitialValues {
  imageName: string;
}

interface IAddContainerDialogProps {
  open: boolean;
  onCancel: () => void;
  onSubmit: (values: IAddDialogFormInitialValues) => void;
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
  private readonly validationSchema = object().shape({
    imageName: string().required('Image name is required')
  });

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
            To run a new container, please provide an image name. Docker will
            pull the image if necessary and will run a container with it.
          </DialogContentText>
          <Formik
            initialValues={{ imageName: '' }}
            onSubmit={onSubmit}
            validationSchema={this.validationSchema}>
            {(props: FormikProps<IAddDialogFormInitialValues>) => (
              <form onSubmit={props.handleSubmit}>
                <Field
                  name="imageName"
                  render={({
                    field
                  }: FieldProps<IAddDialogFormInitialValues>) => (
                    <TextField {...field} fullWidth={true} label="Image name" />
                  )}
                />
              </form>
            )}
          </Formik>
        </DialogContent>
        <DialogActions>
          <Button type="button" onClick={onCancel} color="primary">
            Cancel
          </Button>
          <Button type="submit" color="primary">
            Submit
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
}

export default AddContainerDialog;
