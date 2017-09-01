const express = require('express')
const { postgraphql } = require('postgraphql')
const passport = require('passport')
const passportCas = require('passport-cas')
const jwt = require('jsonwebtoken')
const { studentExists, getStudent, insertStudent } = require('./db')
const { lookupByAggieNumber, getStudentSchedule } = require('./usuApi')
const config = require('./config')

var app = express()

app.get('/', (req, res) => {
  res.send('Hello World!')
})

const getOrSyncStudent = async aNumber => {
  const student = await getStudent(aNumber)
  if (student !== undefined) {
    console.log(aNumber, 'FOUND in database')
    return student
  } else {
    console.log(aNumber, 'not in database')
    var studentDetails = await lookupByAggieNumber(aNumber)
    studentDetails.aNumber = aNumber
    const savedStudent = await insertStudent(studentDetails)
    return savedStudent
  }
}

passport.use(
  new passportCas.Strategy(
    {
      version: 'CAS3.0',
      // ssoBaseURL: 'https://login.usu.edu/cas',
      // serverBaseURL: 'https://komaru.eng.usu.edu/login/cas',
      ssoBaseURL: 'http://localhost:8080/cas',
      serverBaseURL: 'http://localhost:5000/login/cas'
    },
    async (profile, done) => {
      const student = await getOrSyncStudent(profile.user)
      return done(null, student)
    }
  )
)

const getJWTTokenForUser = (user, role) =>
  jwt.sign(
    {
      aud: 'postgraphql',
      // role: role,
      // LEFT OFF HERE - student checkin query is failing
      usu_id: (user && user.id) || undefined,
      a_number: (user && user.a_number) || undefined,
      date_created: new Date().toISOString()
    },
    config.jwtSecret
  )

app.use('/login/cas', (req, res, next) => {
  passport.authenticate('cas', (err, user, info) => {
    console.log('/login/cas', err, user, info)
    debugger
    if (err) {
      // Add redirect
      return next(err)
    }
    if (!user) {
      console.log('not user?')
      return res.redirect('/')
    }
    // TODO: Don't forget about the tutor role
    const token = getJWTTokenForUser(user, 'student')
    return res.redirect(`http://localhost:3000/checkin/${token}`)
  })(req, res, next)
})

app.get('/queue/', (req, res) => {
  const token = req.query.token
  return res.send(`received token ${token}`)
})

app.use(passport.initialize())

app.use(
  postgraphql('postgres://postgres:@localhost:5432/postgres', 'tutor_room', {
    graphiql: config.debug,
    disableDefaultMutations: true,
    enableCors: true,
    jwtSecret: config.jwtSecret,
    jwtPgTypeIdentifier: 'tutor_room.jwt_token'
  })
)

app.listen(5000, () => {
  console.log('Tutor Room server listening on port 5000!')
})
