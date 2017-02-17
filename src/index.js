import { ApolloProvider } from 'react-apollo';
import React from 'react';
import ReactDOM from 'react-dom';
import { Route, Router, browserHistory } from 'react-router';

import './assets/react-toolbox/theme.css';
import client from './helpers/createApolloClient';
import SelectClass from './containers/SelectClass';
import StudentCheckIn from './containers/StudentCheckIn';
import theme from './assets/react-toolbox/theme.js';
import ThemeProvider from 'react-toolbox/lib/ThemeProvider';

ReactDOM.render(
  <ThemeProvider theme={theme}>
    <ApolloProvider client={client}>
      <Router history={browserHistory}>
        <Route path="/" component={StudentCheckIn} />
        <Route path="/get-help/:aNumber" component={SelectClass} />
      </Router>
    </ApolloProvider>
  </ThemeProvider>,
  document.getElementById('root')
);
