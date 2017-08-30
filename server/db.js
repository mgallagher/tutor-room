const pg = require('pg')
pg.types.setTypeParser(20, 'text', parseInt) // Makes it so .count() returns an actual integer
const knex = require('knex')
const config = require('./config')

console.log(process.env.NODE_ENV, process.env.HELLO)

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

const studentExists = aggieNumber => {
  return getStudent(aggieNumber).count().then(result => result.count === 1)
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
    .catch(error => console.error('error inserting student into database: ', error))
}

// COURSES
const courseByNumber = number => {
  return psql.select().from('tutor_room.course').where('number', number).first()
}

const courseExists = number => {
  return courseByNumber(number).count().then(result => result.count === 1)
}

const insertCourse = ({ courseNumber, title }) => {
  return psql
    .insert({ course_number: courseNumber, title })
    .into('tutor_room.course')
    .returning('*')
}

const safeInsertCourses = courses => {
  const numbers = courses.map(course => course.number)
  return psql.insert(courses).into('tutor_room.course').whereNotIn('number', numbers)
}

// CLASSES
const classByCrn = crn => {
  return psql.select().from('tutor_room.class').where('crn', crn).first()
}

const classExists = crn => {
  return classByCrn(crn).count().then(result => result.count === 1)
}

const insertClass = ({ crn, termCode, courseNumber }) => {
  return psql.insert({ crn, term_code: termCode, course_number: courseNumber }).returning('*')
}

// const insertCourse

// const students = ['A00883333', 'A17248774']
// students.map(student => studentExists(student).then(r => console.log(r)))
// var yes = studentExists('A00883333').then(r => console.log('hi', r))
// var hi = studentExists('A17248774').then(r => console.log('hi', r))

module.exports = {
  psql,
  studentExists,
  getStudent,
  insertStudent
}
