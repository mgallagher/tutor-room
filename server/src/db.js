// @flow
import pg from 'pg'
pg.types.setTypeParser(20, 'text', parseInt) // Makes it so .count() returns an actual integer
const knex = require('knex')
const config = require('./config')

const psql = knex({
  client: 'pg',
  debug: false,
  connection: {
    host: config.database.host,
    user: config.database.user,
    password: config.database.password,
    database: config.database.database
  }
})

const safeInsert = (query: Knex$QueryBuilder<*>) =>
  psql.raw('? ON CONFLICT DO NOTHING RETURNING *', [query])

// TUTORS
export const getTutor = (aggieNumber: string | number) => {
  return psql('tutor_room.tutor')
    .where('a_number', aggieNumber)
    .first()
    .then((res: ?TutorRecord) => res)
}

// TODO: Delete when Student and Tutors are merged into a single User table
export const insertTutor = (tutor: Tutor) => {
  return psql('tutor_room.tutor')
    .insert({
      id: tutor.id,
      a_number: tutor.aNumber,
      first_name: tutor.firstName,
      last_name: tutor.lastName,
      preferred_name: tutor.preferredName
    })
    .returning('*')
    .then((tutor: TutorRecord[]) => {
      console.log(
        `New tutor (A-number: ${tutor[0].a_number}, id: ${tutor[0].id}) inserted into DB`
      )
      return tutor[0]
    })
    .catch(error =>
      console.log(
        `ERROR! Unable to insert tutor (A-number: ${tutor.aNumber}, id: ${tutor.id}) into DB with error:\n${error}`
      )
    )
}

// STUDENTS
export const getStudentQuery = (aggieNumber: string | number) => {
  return psql
    .select()
    .from('tutor_room.student')
    .where('a_number', aggieNumber)
    .first()
}

export const getStudent = (aggieNumber: string | number) => {
  return getStudentQuery(aggieNumber).then((student: ?StudentRecord) => {
    return student
  })
}

// TODO: Delete when Student and Tutors are merged into a single User table
export const insertStudent = (student: Student) => {
  return psql('tutor_room.student')
    .insert({
      id: student.id,
      a_number: student.aNumber,
      first_name: student.firstName,
      last_name: student.lastName,
      preferred_name: student.preferredName
    })
    .returning('*')
    .then((student: StudentRecord[]) => {
      console.log(
        `New student (A-number: ${student[0].a_number}, id: ${student[0].id}) inserted into DB`
      )
      return student[0]
    })
    .catch(error =>
      console.log(
        `ERROR! Unable to insert student (A-number: ${student.aNumber}, id: ${student.id}) into DB with error:\n${error}`
      )
    )
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

export const insertCourseQuery = (course: Course) => {
  return psql('tutor_room.course').insert(
    ({
      crn: course.crn,
      number: course.number,
      title: course.title,
      term_code: course.termCode
    }: CourseRecord)
  )
}

export const safeInsertCourse = (course: Course) => {
  console.log('Inserting course:', course.title)
  return safeInsert(insertCourseQuery(course)).then((courses: CourseRecord[]) => courses)
}

// STUDENT COURSES
const studentHasCoursesQuery = (studentId: number) => {
  return psql('tutor_room.student_course')
    .where({ student_id: studentId })
    .count()
}

export const studentHasCourses = (studentId: number) => {
  // TODO: ADD TERM CODE!
  return studentHasCoursesQuery(studentId).then((result: { count: number }) => result.count >= 1)
}

const selectStudentCourseQuery = ({ studentId, courseId }: StudentCourse) => {
  return psql('tutor_room.student_course')
    .select()
    .where({ course_id: courseId, student_id: studentId })
}

type StudentCourseInput = { studentId: number | string } & CoursePK
const insertStudentCourseQuery = ({ studentId, number, crn, termCode }: StudentCourseInput) => {
  return psql('tutor_room.student_course').insert(
    psql('tutor_room.course')
      .select(psql.raw(`'${studentId}'`), 'id')
      .where({ crn: crn, number: number, term_code: termCode })
  )
}

export const safeInsertStudentCourse = ({ studentId, number, crn, termCode }: StudentCourseInput) =>
  safeInsert(
    insertStudentCourseQuery({ studentId, number, crn, termCode })
  ).then((res: StudentCourseRecord[]) => {
    return res
  })
