// @flow
import express from 'express'
import { postgraphql } from 'postgraphql'
import passport from 'passport'
import passportCas from 'passport-cas'
import jwt from 'jsonwebtoken'
import {
  getStudent,
  getTutor,
  insertStudent,
  safeInsertCourse,
  safeInsertStudentCourse,
  studentHasCourses
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
    await Promise.all(studentCourses.map(safeInsertCourse))
    await Promise.all(studentCourses.map(course => safeInsertStudentCourse({ studentId, ...course })))
  }
}

// syncStudentSchedule('A01186010')
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
      // profile.user is the aggie number
      return done(null, profile.user)
    }
  )
)

const getJWTTokenForUser = (user: StudentRecord | TutorRecord, role: string) =>
  jwt.sign(
    {
      aud: 'postgraphql',
      // role: role,
      usu_id: (user && user.id) || undefined,
      a_number: (user && user.a_number) || undefined,
      date_created: new Date().toISOString()
    },
    config.jwtSecret
  )

app.use('/login/cas', (req: express$Request, res, next) => {
  passport.authenticate('cas', async (err, aggieNumber: string, info) => {
    if (err) {
      return next(err)
    }
    if (!aggieNumber) {
      return res.redirect('/')
    }
    // Tutor role
    const tutor = await getTutor(aggieNumber)
    if (tutor != null) {
      const token = getJWTTokenForUser(tutor, 'tutor')
      return res.redirect(`http://localhost:3000/queue/${token}`)
    }
    // Student role
    const student = await getOrSyncStudent(aggieNumber)
    if (student != null) {
      const token = getJWTTokenForUser(student, 'student')
      return res.redirect(`http://localhost:3000/checkin/${token}`)
    }
    return res.send('Error occured during student/tutor retrieval process')
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
