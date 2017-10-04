const env = process.env.NODE_ENV || 'development'

const config = {
  development: {
    graphql_url: 'http://localhost:5000/graphql'
  },
  production: {
    graphql_url: 'https://komaru.eng.usu.edu/graphql/'
  }
}

export default config[env]
