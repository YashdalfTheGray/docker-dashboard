import * as React from 'react';
import * as ReactDOM from 'react-dom';
import * as injectTapEventPlugin from 'react-tap-event-plugin';

import { AppComponent } from './components/app';

injectTapEventPlugin();

ReactDOM.render(
    <AppComponent />,
    document.querySelector('#app')
);
