import * as React from 'react';

import { Theme } from '@material-ui/core/styles/createMuiTheme';
import createStyles from '@material-ui/core/styles/createStyles';
import withStyles, { WithStyles } from '@material-ui/core/styles/withStyles';
import Typography from '@material-ui/core/Typography';

import { IContainer } from '../types/Container';
import ContainerListItem from './ContainerListItem';

const containerListStyles = (theme: Theme) =>
  createStyles({
    root: {
      display: 'flex',
      flexWrap: 'wrap',
      justifyContent: 'space-around',
      overflow: 'hidden',
      backgroundColor: theme.palette.background.paper,
      marginBottom: '16px'
    }
  });

interface IContainerListProps {
  containers: IContainer[];
  title?: string;
  openLogsDialog: (container: IContainer) => void;
}

type ContainerListProps = IContainerListProps &
  WithStyles<typeof containerListStyles>;

class ContainerList extends React.Component<ContainerListProps> {
  public render() {
    const { classes, title, containers, openLogsDialog } = this.props;
    return (
      <div style={{ margin: '16px' }}>
        <Typography variant="h5">{title}</Typography>
        <Typography variant="subtitle1">
          {containers.length === 0 ? 'No containers to show' : ''}
        </Typography>
        <div style={{ margin: '8px' }}>
          {this.props.containers.map(c => (
            <ContainerListItem
              key={c.name}
              container={c}
              openLogsDialog={openLogsDialog}
            />
          ))}
        </div>
      </div>
    );
  }
}

export default withStyles(containerListStyles)(ContainerList);
