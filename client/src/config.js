const env = process.env.NODE_ENV || 'development'

const config = {
  development: {
    graphqlURL: 'http://localhost:5000/graphql',
    casLoginURL: 'http://localhost:8080/cas/login?service=http://localhost:5000/login/cas&renew=true',
    socketURL: 'http://localhost:5050'
  },
  production: {
    graphqlURL: 'https://komaru.eng.usu.edu/graphql/',
    casLoginURL: 'https://login.usu.edu/cas/login?service=https://komaru.eng.usu.edu/login/cas&renew=true',
    socketURL: 'https://komaru.eng.usu.edu/'
  }
}

export default config[env]
