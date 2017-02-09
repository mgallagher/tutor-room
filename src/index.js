import { ApolloProvider } from 'react-apollo';
import injectTapEventPlugin from 'react-tap-event-plugin';
import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import client from './helpers/create-apollo-client';
import MyComponentWithData from './App';

injectTapEventPlugin();

ReactDOM.render(
  <ApolloProvider client={client}>
    <MyComponentWithData />
  </ApolloProvider>,
  document.getElementById('root')
);
