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
    jwtSecret: process.env.JWT_SECRET,
    usuApi: usuConfig,
    debug: true,
    database: dbConfig,
    serverURL: 'http://localhost:5000',
    ssoBaseURL: 'http://localhost:8080/cas',
    frontendURL: 'http://localhost:3000'
  },
  production: {
    jwtSecret: process.env.JWT_SECRET,
    usuApi: usuConfig,
    debug: false,
    database: dbConfig,
    serverURL: 'https://komaru.eng.usu.edu',
    ssoBaseURL: 'https://login.usu.edu/cas',
    frontendURL: 'https://komaru.eng.usu.edu'
  }
}

module.exports = config[env]
