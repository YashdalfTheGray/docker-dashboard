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
import TextField from '@material-ui/core/TextField';

import { Field, FieldProps, Formik, FormikProps, getIn } from 'formik';
import { object, string } from 'yup';

export interface IRunDialogFormValues {
  imageName: string;
  name?: string;
}

interface IRunContainerDialogProps {
  open: boolean;
  onCancel: () => void;
  onSubmit: (values: IRunDialogFormValues) => void;
}

const runContainerDialogStyles = (theme: Theme) =>
  createStyles({
    field: {
      marginBottom: '16px'
    }
  });

type RunContainerDialogProps = IRunContainerDialogProps &
  WithStyles<typeof runContainerDialogStyles>;

class RunContainerDialog extends React.Component<RunContainerDialogProps> {
  private readonly validationSchema = object().shape({
    imageName: string().required('Image name is required'),
    name: string()
  });

  public render() {
    const { open, onCancel, onSubmit, classes } = this.props;

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
            {(props: FormikProps<IRunDialogFormValues>) => (
              <form onSubmit={props.handleSubmit}>
                <Field
                  name="imageName"
                  render={({
                    field,
                    form
                  }: FieldProps<IRunDialogFormValues>) => (
                    <TextField
                      {...field}
                      className={classes.field}
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
                <Field
                  name="name"
                  render={({
                    field,
                    form
                  }: FieldProps<IRunDialogFormValues>) => (
                    <TextField
                      className={classes.field}
                      {...field}
                      fullWidth={true}
                      label="Name (optional)"
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

export default withStyles(runContainerDialogStyles)(RunContainerDialog);
