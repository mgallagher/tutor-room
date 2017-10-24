const env = process.env.NODE_ENV || 'development'

const config = {
  development: {
    graphqlURL: 'http://localhost:5000/graphql',
    casLoginURL: 'http://localhost:8080/cas/login?service=http://localhost:5000/login/cas'
  },
  production: {
    graphqlURL: 'https://komaru.eng.usu.edu/graphql/',
    casLoginURL: 'https://login.usu.edu/cas/login?service=https://komaru.eng.usu.edu/login/cas'
  }
}

export default config[env]