const pg = require('pg')
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

const getStudent = aggieNumber => {
  return psql
    .select()
    .from('tutor_room.student')
    .where('a_number', aggieNumber)
    .first()
    .then(result => {
      return result
    })
}

const insertStudent = ({ id, aNumber, firstName, lastName, preferredName }) => {
  return psql
    .insert({
      id: id,
      a_number: aNumber,
      first_name: firstName,
      last_name: lastName,
      preferred_name: preferredName
    })
    .into('tutor_room.student')
    .returning('*')
    .then(student => {
      console.log(`New student (A-number: ${aNumber}, id: ${id}) inserted into DB`)
      return student
    })
    .catch(error => console.error('error inserting student into database: ', error))
}

// COURSES
const courseByNumber = number => {
  return psql
    .select()
    .from('tutor_room.course')
    .where('number', number)
    .first()
}

const courseExists = number => {
  return courseByNumber(number)
    .count()
    .then(result => result.count === 1)
}

const insertCourse = ({ courseNumber, title }) => {
  return psql
    .insert({ course_number: courseNumber, title })
    .into('tutor_room.course')
    .returning('*')
}

const safeInsertCourses = courses => {
  const numbers = courses.map(course => course.number)
  return psql
    .insert(courses)
    .into('tutor_room.course')
    .whereNotIn('number', numbers)
}

// CLASSES
const classByCrn = crn => {
  return psql
    .select()
    .from('tutor_room.class')
    .where('crn', crn)
    .first()
}

const classExists = crn => {
  return classByCrn(crn)
    .count()
    .then(result => result.count === 1)
}

const insertClass = ({ crn, termCode, courseNumber }) => {
  return psql.insert({ crn, term_code: termCode, course_number: courseNumber }).returning('*')
}

module.exports = {
  psql,
  studentExists,
  getStudent,
  insertStudent
}
