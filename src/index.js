import { ApolloProvider } from 'react-apollo';
import React from 'react';
import ReactDOM from 'react-dom';
import { Route, Router, browserHistory } from 'react-router';
import client from './helpers/createApolloClient';
import App from './App';
import SelectClass from './containers/SelectClass';

import './assets/react-toolbox/theme.css';
import theme from './assets/react-toolbox/theme.js';
import ThemeProvider from 'react-toolbox/lib/ThemeProvider';

ReactDOM.render(
  <ThemeProvider theme={theme}>
    <ApolloProvider client={client}>
      <Router history={browserHistory}>
        <Route path="/" component={App} />
        <Route path="/get-help/:aNumber" component={SelectClass} />
      </Router>
    </ApolloProvider>
  </ThemeProvider>,
  document.getElementById('root')
);
