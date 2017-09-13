import gql from 'graphql-tag'

import { SessionData } from './fragments'

export const AllSessions = gql`
  query allSessions {
    allSessions(orderBy:TIME_IN_ASC) {
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
      minutes
      hours
    }
  }
`
