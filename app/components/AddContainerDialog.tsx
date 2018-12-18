import * as React from 'react';

import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import TextField from '@material-ui/core/TextField';

import { Field, FieldProps, Formik, FormikProps, getIn } from 'formik';
import { object, string } from 'yup';

export interface IAddDialogFormValues {
  imageName: string;
}

interface IAddContainerDialogProps {
  open: boolean;
  onCancel: () => void;
  onSubmit: (values: IAddDialogFormValues) => void;
}

class AddContainerDialog extends React.Component<IAddContainerDialogProps> {
  private readonly validationSchema = object().shape({
    imageName: string().required('Image name is required')
  });

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
            {(props: FormikProps<IAddDialogFormValues>) => (
              <form onSubmit={props.handleSubmit}>
                <Field
                  name="imageName"
                  render={({
                    field,
                    form
                  }: FieldProps<IAddDialogFormValues>) => (
                    <TextField
                      {...field}
                      autoFocus={true}
                      fullWidth={true}
                      label="Image name"
                      error={
                        getIn(form.touched, field.name) &&
                        !!getIn(form.errors, field.name)
                      }
                      helperText={
                        getIn(form.touched, field.name)
                          ? getIn(form.errors, field.name)
                          : ''
                      }
                    />
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
