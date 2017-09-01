import gql from 'graphql-tag'

export const SessionData = gql`
  fragment SessionData on Session {
    id
    nodeId
    crn
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
    courseByCrn {
      crn
      number
      title
    }
  }
`
