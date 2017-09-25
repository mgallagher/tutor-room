import gql from 'graphql-tag'

export const SessionData = gql`
  fragment SessionData on Session {
    id
    nodeId
    courseId
    reason
    description
    timeIn
    timeClaimed
    timeOut
    studentByStudentId {
      aNumber
      preferredName
      lastName
    }
    course: courseByCourseId {
      id
      number
      title
    }
  }
`
