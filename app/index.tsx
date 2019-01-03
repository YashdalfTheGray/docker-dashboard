import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { hot } from 'react-hot-loader/root';

import CssBaseline from '@material-ui/core/CssBaseline';

import AppComponent from './components/app';

const WrappedApp = hot(() => (
  <CssBaseline>
    <AppComponent />
  </CssBaseline>
));

ReactDOM.render(<WrappedApp />, document.querySelector('#app'));
