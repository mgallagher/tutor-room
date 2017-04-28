import gql from 'graphql-tag';

import { SessionData } from './fragments';

export const CreateSession = gql`
  mutation startSession($aNumber: String!, $crn:Int!, $reason: SessionReason, $description:String) {
    startSession(input: {aNumber: $aNumber, crn: $crn, reason: $reason, description:$description}) {
      session {
        ...SessionData
      }
    }
  }
  ${SessionData}
`;

export const ClaimSession = gql`
  mutation claimSession($sessionId: Int!, $tutorId:Int!) {
    claimSession(input:{sessionId: $sessionId, tutorId:$tutorId}) {
      session {
        nodeId
        id
        timeClaimed
        timeOut
        description
      }
    }
  }
`;

export const FinishSession = gql`
  mutation finishSession($sessionId: Int!, $tag: SessionTag, $notes: String, $requeued: Boolean) {
    finishSession(input:{sessionId: $sessionId, tag: $tag, notes: $notes, requeued: $requeued}) {
      session {
        nodeId
        id
        timeClaimed
        timeOut
        description
      }
    }
  }
`;

export const DeleteSession = gql`
  mutation deleteSession($sessionId: Int!) {
    deleteSession(input:{sessionId: $sessionId}) {
      session {
        nodeId
        id
      }
    }
  }
`;
