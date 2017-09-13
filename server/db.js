// @flow
import pg from 'pg'
pg.types.setTypeParser(20, 'text', parseInt) // Makes it so .count() returns an actual integer
const knex = require('knex')
const config = require('./config')

const psql = knex({
  client: 'pg',
  debug: config.debug,
  connection: {
    host: config.database.host,
    user: config.database.user,
    password: config.database.password,
    database: config.database.database
  }
})

// STUDENTS
export const getStudent = (aggieNumber: string | number): Promise<?StudentRecord> => {
  return psql
    .select()
    .from('tutor_room.student')
    .where('a_number', aggieNumber)
    .first()
    .then((student: ?StudentRecord) => {
      return student
    })
}

export const insertStudent = (student: Student): Promise<?StudentRecord> => {
  return psql
    .insert({
      id: student.id,
      a_number: student.aNumber,
      first_name: student.firstName,
      last_name: student.lastName,
      preferred_name: student.preferredName
    })
    .into('tutor_room.student')
    .returning('*')
    .then((student: StudentRecord[]) => {
      console.log(
        `New student (A-number: ${student[0].a_number}, id: ${student[0].id}) inserted into DB`
      )
      return student[0]
    })
    .catch(error => {
      console.error('error inserting student into database: ', error)
      return null
    })
}

// COURSES
type CoursePK = { number: number | string, crn: number | string, termCode: number | string }
const getCourseQuery = ({ number, crn, termCode }: CoursePK) => {
  return psql('tutor_room.course')
    .where({ crn: crn, number: number, term_code: termCode })
    .first()
}

export const getCourse = ({ number, crn, termCode }: CoursePK) => {
  return getCourseQuery({ number, crn, termCode }).then((result: CourseRecord) => result)
}

export const courseExists = ({ number, crn, termCode }: CoursePK) => {
  return getCourseQuery({ number, crn, termCode })
    .count()
    .then((result: { count: number }) => result.count === 1)
}

export const insertCourse = (course: Course) => {
  console.log('Inserting course:\n', course)
  return psql('tutor_room.course')
    .insert(
      ({
        crn: course.crn,
        number: course.number,
        title: course.title,
        term_code: course.termCode
      }: CourseRecord)
    )
    .returning('*')
    .then((courses: CourseRecord[]) => courses)
}

// STUDENT COURSES
const selectStudentCourseQuery = ({ studentId, courseId }: StudentCourse) => {
  return psql('tutor_room.student_course')
    .select()
    .where({ course_id: courseId, student_id: studentId })
}

export const safeInsertStudentCourse = ({ studentId, courseId }: StudentCourse) => {
  // This creates a "INSERT WHERE NOT EXISTS" query, so if an existing student course is found, it won't be inserted
  return psql('tutor_room.student_course').insert(
    psql.select(studentId, courseId).whereNotExists(selectStudentCourseQuery({ studentId, courseId }))
  )
}
