const express = require('express')
const { postgraphql } = require('postgraphql')
const passport = require('passport')
const passport_cas = require('passport-cas')
const { studentExists, insertStudent } = require('./db')
const { lookupByAggieNumber, getStudentSchedule } = require('./usuApi')
const config = require('./config')

var app = express()

app.get('/', function(req, res) {
  res.send('Hello World!')
})

const getOrSyncStudent = async aNumber => {
  const exists = await studentExists(aNumber)
  if (!exists) {
    console.log(aNumber, 'not in database')
    var studentDetails = await lookupByAggieNumber(aNumber)
    studentDetails.aNumber = aNumber
    const savedStudent = await insertStudent(studentDetails)
    return savedStudent
    // const studentSchedule = await getStudentSchedule(studentDetails.id)
    // const csCourses = studentSchedule.filter(course => course.courseSubject === 'CS')
    // csCourses.map(course => {})
    // split data into course, class, and student_class
  } else {
    return getStudent(aNumber)
  }
}

passport.use(
  new passport_cas.Strategy(
    {
      version: 'CAS3.0',
      ssoBaseURL: 'https://login.usu.edu/cas',
      serverBaseURL: 'https://komaru.eng.usu.edu/login/cas',
      useSaml: true
    },
    async function(profile, done) {
      console.log('received user', profile.attributes)
      const student = await getOrSyncStudent(profile.attributes.cn)
      return done(null, student)
    }
  )
)

const LocalStrategy = require('passport-local').Strategy
passport.use(
  new LocalStrategy(function(username, password, done) {
    console.log(username, password)

    // User.findOne({ username: username }, function(err, user) {
    //   if (err) {
    //     return done(err)
    //   }
    //   if (!user) {
    //     return done(null, false, { message: 'Incorrect username.' })
    //   }
    //   if (!user.validPassword(password)) {
    //     return done(null, false, { message: 'Incorrect password.' })
    //   }
    //   return done(null, user)
    // })
  })
)

app.post(
  '/login/dev',
  passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login',
    failureFlash: true
  })
)

app.use('/login/cas', function(req, res, next) {
  passport.authenticate('cas', function(err, user, info) {
    if (err) {
      // Add redirect
      return next(err)
    }

    if (!user) {
      req.session.messages = info.message
      return res.redirect('/')
    }

    req.logIn(user, function(err) {
      if (err) {
        return next(err)
      }
      req.session.messages = ''
      return res.redirect('/')
    })
  })(req, res, next)
})

app.use(passport.initialize())
// app.use(
//   postgraphql('postgres://postgres:@localhost:5432/postgres', 'tutor_room', {
//     graphiql: config.debug,
//     disableDefaultMutations: true,
//     enableCors: true
//   })
// )

app.listen(5000, function() {
  console.log('Tutor Room server listening on port 5000!')
})
