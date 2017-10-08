// @flow
import axios from 'axios'
import moment from 'moment'
import config from './config'

var usuApi = axios.create({
  baseURL: 'https://api.usu.edu/v1/',
  auth: {
    username: config.usuApi.username,
    password: config.usuApi.password
  }
})

export const lookupByAggieNumber = (aNumber: string | number): Promise<?USUPerson> => {
  return usuApi
    .get(`/people/?username=${aNumber}`)
    .then((res: { data: USUPerson[] }) => {
      return res.data.length === 1 ? res.data[0] : null
    })
    .catch(reason => console.error('Student lookup failed with error: ', reason))
}

export const getStudentSchedule = (studentId: number | string, termCode: number | string) => {
  return usuApi
    .get(`/people/${studentId}/student-schedule/?term=${termCode}`)
    .then((res: { data: USUStudentCourseDetail[] }) => res.data)
    .catch(reason => console.error('Student schedule retrieval failed with error: ', reason))
}

export const getTerm = (date: string = moment().format('YYYYMMDD')): Promise<?TermInfo> => {
  return usuApi
    .get(`/terms?date=${date}`)
    .then(res => {
      if (res.data.length === 1) {
        return res.data[0]
      } else {
        return null
      }
    })
    .catch(reason => console.error('Get current term failed with error: ', reason))
}
