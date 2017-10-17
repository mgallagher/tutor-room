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
    frontendURL: 'http://localhost:3000',
    serverURL: 'http://localhost:5000',
    ssoBaseURL: 'http://localhost:8080/cas',
    casLoginURL: 'http://localhost:8080/cas/login?service=http://localhost:5000/login/cas'
  },
  production: {
    jwtSecret: process.env.JWT_SECRET,
    usuApi: usuConfig,
    debug: false,
    database: dbConfig,
    frontendURL: 'https://komaru.eng.usu.edu',
    serverURL: 'https://komaru.eng.usu.edu',
    ssoBaseURL: 'https://login.usu.edu/cas',
    casLoginURL: 'https://login.usu.edu/cas/login?service=https://komaru.eng.usu.edu/login/cas'
  }
}

module.exports = config[env]
