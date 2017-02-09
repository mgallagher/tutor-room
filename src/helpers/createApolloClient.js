import ApolloClient, { createNetworkInterface } from 'apollo-client';

const client = new ApolloClient({
  dataIdFromObject: object => object.__id,
  networkInterface: createNetworkInterface({ uri: 'http://localhost:5000/graphql' }),
  connectToDevTools: true
});

export default client
