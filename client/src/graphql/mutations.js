import gql from 'graphql-tag';

export const CreateSession = gql`
  mutation startSession($aNumber: String!, $crn:Int!, $reason: TutoringReason, $description:String) {
    startSession(input: {aNumber: $aNumber, crn: $crn, reason: $reason, description:$description}) {
      session {
        nodeId
        id
      }
    }
  }
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
  mutation finishSession($sessionId: Int!) {
    finishSession(input:{sessionId: $sessionId}) {
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