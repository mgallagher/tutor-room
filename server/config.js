require('dotenv').config()
const env = process.env.NODE_ENV || 'development'

const usuConfig = {
  username: process.env.USU_API_USERNAME,
  password: process.env.USU_API_PASSWORD
}

const dbConfig = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
}

const config = {
  development: {
    graphqlUri: 'http://localhost:8000/graphql',
    jwtSecret: process.env.JWT_SECRET,
    usuApi: usuConfig,
    debug: true,
    database: dbConfig
  },
  production: {
    graphqlUri: 'https://komaru.eng.usu.edu/graphql',
    jwtSecret: process.env.JWT_SECRET,
    usuApi: usuConfig,
    debug: false,
    database: dbConfig
  }
}

module.exports = config[env]
