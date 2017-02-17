import ApolloClient, { createNetworkInterface } from 'apollo-client';

const client = new ApolloClient({
  dataIdFromObject: object => object.nodeid,
  networkInterface: createNetworkInterface({ uri: 'http://localhost:5000/graphql' }),
  connectToDevTools: true,
  // addTypename: false
});

export default client
