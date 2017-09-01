import { ApolloProvider } from 'react-apollo'
import React from 'react'
import ReactDOM from 'react-dom'
import ApolloClient, { createNetworkInterface } from 'apollo-client'
import { ThemeProvider as AppTheme } from 'styled-components'

import Routes from './routes'
import colors from './styles'

const networkInterface = createNetworkInterface({
  uri: 'http://localhost:5000/graphql'
})

networkInterface.use([
  {
    applyMiddleware(req, next) {
      if (!req.options.headers) {
        req.options.headers = {}
      }
      const token = localStorage.getItem('token')
      req.options.headers.authorization = token ? `Bearer ${token}` : null
      next()
    }
  }
])

const client = new ApolloClient({
  networkInterface,
  connectToDevTools: true
})

ReactDOM.render(
  <AppTheme theme={colors}>
    <ApolloProvider client={client}>
      <Routes />
    </ApolloProvider>
  </AppTheme>,
  document.getElementById('root')
)
