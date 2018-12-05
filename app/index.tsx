import * as React from 'react';
import * as ReactDOM from 'react-dom';

import CssBaseline from '@material-ui/core/CssBaseline';

import AppComponent from './components/app';

ReactDOM.render(
  <CssBaseline>
    <AppComponent />
  </CssBaseline>,
  document.querySelector('#app')
);
