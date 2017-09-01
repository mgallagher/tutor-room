const axios = require('axios')
const config = require('./config')

var usuApi = axios.create({
  baseURL: 'https://api.usu.edu/v1/',
  auth: {
    username: config.usuApi.username,
    password: config.usuApi.password
  }
})

const lookupByAggieNumber = aNumber => {
  return usuApi
    .get(`/people/?username=${aNumber}`)
    .then(res => {
      return res.data.length === 1 ? res.data[0] : {}
    })
    .catch(reason => console.error('Student lookup failed with error: ', reason))
}

const getStudentSchedule = (id, termId) => {
  return usuApi
    .get(`/people/${id}/student-schedule/?term=${201740}`)
    .then(res => res.data)
    .catch(reason => console.error('Student schedule retrieval failed with error: ', reason))
}

const getCurrentTerm = () => {
  return usuApi
    .get(`/terms?date=${date}`)
    .then(res => res.data)
    .catch(reason => console.error('Get current term failed with error: ', reason))
}

module.exports = {
  lookupByAggieNumber,
  getStudentSchedule,
  getCurrentTerm
}
