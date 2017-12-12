import gql from 'graphql-tag'

import { SessionData } from './fragments'

export const AllSessions = gql`
  query allSessions($startDate: Datetime!) {
    currentTutor {
      id
      preferredName
    }
    allSessions(orderBy:TIME_IN_DESC, filter: {timeIn: {greaterThan: $startDate}}) {
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

export const Sessions = gql`
  query Sessions($startDate: Datetime!) {
    currentTutor {
      id
      preferredName
    }
    currentSessions: allSessions(
      orderBy: TIME_IN_DESC
      filter: {
        timeIn: { greaterThan: $startDate }
        timeClaimed: { null: false }
        timeOut: { null: true }
      }
    ) {
      totalCount
      nodes {
        ...SessionData
      }
    }
    queuedSessions: allSessions(
      orderBy: TIME_IN_DESC
      filter: {
        timeIn: { greaterThan: $startDate }
        timeClaimed: { null: true }
        timeOut: { null: true }
      }
    ) {
      totalCount
      nodes {
        ...SessionData
      }
    }
    priorSessions: allSessions(
      orderBy: TIME_IN_DESC
      filter: {
        timeIn: { greaterThan: $startDate }
        timeClaimed: { null: false }
        timeOut: { null: false }
      }
    ) {
      totalCount
      nodes {
        ...SessionData
      }
    }
  }
  ${SessionData}
`
