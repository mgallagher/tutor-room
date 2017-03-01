import { ApolloProvider } from 'react-apollo';
import React from 'react';
import ReactDOM from 'react-dom';
import { ThemeProvider as AppTheme } from 'styled-components';

import './assets/react-toolbox/theme.css';
import client from './helpers/createApolloClient';
import Routes from './routes';
import theme from './assets/react-toolbox/theme.js';
import usuTheme from './styles';
import ThemeProvider from 'react-toolbox/lib/ThemeProvider';

ReactDOM.render(
  <AppTheme theme={usuTheme}>
    <ThemeProvider theme={theme}>
      <ApolloProvider client={client}>
        <Routes />
      </ApolloProvider>
    </ThemeProvider>
  </AppTheme>,
  document.getElementById('root')
);
