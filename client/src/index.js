import { ApolloProvider } from 'react-apollo';
import React from 'react';
import ReactDOM from 'react-dom';
import { ThemeProvider as AppTheme } from 'styled-components';

import client from './helpers/createApolloClient';
import Routes from './routes';
import colors from './styles';

ReactDOM.render(
  <AppTheme theme={colors}>
    <ApolloProvider client={client}>
      <Routes />
    </ApolloProvider>
  </AppTheme>,
  document.getElementById('root')
);
