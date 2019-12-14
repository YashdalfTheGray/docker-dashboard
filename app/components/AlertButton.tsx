import Button from '@material-ui/core/Button';
import { red } from '@material-ui/core/colors';
import { withStyles } from '@material-ui/core/styles';

export default withStyles(theme => ({
  root: {
    color: red[800]
  }
}))(Button);
