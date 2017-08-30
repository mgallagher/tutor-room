require('dotenv').config()
const env = process.env.NODE_ENV || 'development'

const config = {
  development: {
    graphql_url: 'http://localhost:8000/graphql',
    jwtSecret: process.env.JWT_SECRET,
    usuApiUsername: process.env.USU_API_USERNAME,
    usuApiPassword: process.env.USU_API_PASSWORD,
    debug: true,
    database: {
      host: 'localhost',
      user: 'postgres',
      password: null,
      database: 'postgres'
    }
  },
  production: {
    graphql_url: 'https://komaru.eng.usu.edu/graphql',
    jwtSecret: process.env.JWT_SECRET,
    usuApiUsername: process.env.USU_API_USERNAME,
    usuApiPassword: process.env.USU_API_PASSWORD,
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
