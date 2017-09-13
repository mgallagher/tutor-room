// @flow
import express from 'express'
import { postgraphql } from 'postgraphql'
import passport from 'passport'
import passportCas from 'passport-cas'
import jwt from 'jsonwebtoken'
import {
  getStudent,
  insertStudent,
  courseExists,
  insertCourse,
  getCourse,
  safeInsertStudentCourse
} from './db'
import { lookupByAggieNumber, getStudentSchedule, getTerm } from './usuApi'
import { courseDetailToCourse } from './helpers'
import config from './config'

var app = express()

app.get('/', (req: express$Request, res) => {
  res.send('Hello World!')
})

const getOrSyncStudent = async (aNumber: string | number) => {
  const student = await getStudent(aNumber)
  if (student != null) {
    console.log(aNumber, 'FOUND in database')
    return student
  } else {
    console.log(aNumber, 'not in database')
    const studentDetails = await lookupByAggieNumber(aNumber)
    if (studentDetails != null) {
      const student = {
        id: studentDetails.id,
        aNumber: studentDetails.username,
        firstName: studentDetails.firstName,
        lastName: studentDetails.lastName,
        preferredName: studentDetails.preferredName
      }
      const savedStudent = await insertStudent(student)
      return savedStudent
    }
  }
}

const insertCourseIfNotExists = (course: Course) => {
  courseExists(course).then(exists => {
    if (!exists) {
      return insertCourse(course)
    }
  })
}

const syncStudentSchedule = async (studentId: string | number) => {
  console.log(`Retrieving schedule for student ${studentId}`)
  // TODO: Might want to store term details rather than retrieving every time
  const termInfo = await getTerm()
  if (termInfo != null) {
    const studentSchedule = await getStudentSchedule(studentId, termInfo.termCode)
    // TODO: Add option for other subjects
    const studentCourses = studentSchedule
      .filter(course => course.courseSubject === 'CS')
      .map(courseDetailToCourse)
    await studentCourses.map(insertCourseIfNotExists)
    // INSERT STUDENT COURSES NOW!!
    await studentCourses.map(course => getCourse(course))
  }
}

syncStudentSchedule('A01186010')
// syncStudentSchedule(2415222)

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

app.use('/login/cas', (req: express$Request, res, next) => {
  passport.authenticate('cas', (err, user, info) => {
    console.log('/login/cas', err, user, info)
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

app.get('/queue/', (req: express$Request, res) => {
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
