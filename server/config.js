require('dotenv').config()
const env = process.env.NODE_ENV || 'development'

const usuConfig = {
  username: process.env.USU_API_USERNAME,
  password: process.env.USU_API_PASSWORD
}

const config = {
  development: {
    graphqlUri: 'http://localhost:8000/graphql',
    jwtSecret: process.env.JWT_SECRET,
    usuApi: usuConfig,
    debug: true,
    database: {
      host: 'localhost',
      user: 'postgres',
      password: null,
      database: 'postgres'
    }
  },
  production: {
    graphqlUri: 'https://komaru.eng.usu.edu/graphql',
    jwtSecret: process.env.JWT_SECRET,
    usuApi: usuConfig,
    debug: false,
    database: {
      // host: 'localhost',
      // user: 'postgres',
      // password: null,
      // database: 'postgres',
      // debug: false
    }
  }
}

module.exports = config[env]
