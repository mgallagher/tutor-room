import gql from 'graphql-tag'

import { SessionData } from './fragments'

export const AllSessions = gql`
  query allSessions {
    currentTutor {
      firstName
      id
    }
    allSessions(orderBy:TIME_IN_DESC, first:40) {
      totalCount
      nodes {
        ...SessionData
      }
    }
  }
  ${SessionData}
`

export const AverageWait = gql`
  query averageWait {
    latestAverageWait {
      hours
      minutes
      seconds
    }
  }
`

export const CurrentUser = gql`
  query currentUser {
    currentTutor {
      id
      preferredName
    }
    currentStudent {
      id
      preferredName
    }
  }
`
