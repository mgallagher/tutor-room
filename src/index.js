import { ApolloProvider } from 'react-apollo';
import React from 'react';
import ReactDOM from 'react-dom';
import { Route, Router, browserHistory } from 'react-router';
import { ThemeProvider } from 'styled-components';

import './assets/react-toolbox/theme.css';
import client from './helpers/createApolloClient';
import SelectClass from './containers/SelectClass';
import StudentCheckIn from './containers/StudentCheckIn';
import theme from './assets/react-toolbox/theme.js';
import { theme as localTheme } from './styles';
import { ThemeProvider as ReactToolboxThemeProvider } from 'react-toolbox/lib/ThemeProvider';

ReactDOM.render(
  <ThemeProvider theme={localTheme}>
    <ReactToolboxThemeProvider theme={theme}>
      <ApolloProvider client={client}>
        <Router history={browserHistory}>
          <Route path="/" component={StudentCheckIn} />
          <Route path="/get-help/:aNumber" component={SelectClass} />
        </Router>
      </ApolloProvider>
    </ReactToolboxThemeProvider>
  </ThemeProvider>,
  document.getElementById('root')
);
