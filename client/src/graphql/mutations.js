import gql from 'graphql-tag'

import { SessionData } from './fragments'

export const StartSession = gql`
  mutation startSession($courseId: Int!, $reason: SessionReason, $description:String) {
    startSession(input: {courseId: $courseId, reason: $reason, description:$description}) {
      session {
        ...SessionData
      }
    }
  }
  ${SessionData}
`

export const ClaimSession = gql`
  mutation claimSession($sessionId: Int!) {
    claimSession(input: { sessionId: $sessionId }) {
      session {
        ...SessionData
      }
    }
  }
  ${SessionData}
`

export const FinishSession = gql`
  mutation finishSession($sessionId: Int!, $tag: SessionTag, $notes: String, $requeued: Boolean) {
    finishSession(input: { sessionId: $sessionId, tag: $tag, notes: $notes, requeued: $requeued }) {
      session {
        ...SessionData
      }
    }
  }
  ${SessionData}
`

export const DeleteSession = gql`
  mutation deleteSession($sessionId: Int!) {
    deleteSession(input: { sessionId: $sessionId }) {
      session {
        ...SessionData
      }
    }
  }
  ${SessionData}
`

export const CopySession = gql`
  mutation copySession($sessionId: Int!) {
    copySession(input: { sessionId: $sessionId }) {
      session {
        ...SessionData
      }
    }
  }
  ${SessionData}
`
