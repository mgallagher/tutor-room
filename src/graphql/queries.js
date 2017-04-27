import gql from 'graphql-tag';

export const AllSessions = gql`
  query allSessions {
    allSessions(orderBy:TIME_IN_ASC) {
      totalCount
      nodes {
        id
        nodeId
        reason
        description
        timeIn
        timeClaimed
        timeOut
        studentByStudentId {
          fullName
        }
        classByCrn {
          instructor
          courseByCourseNumber {
            courseNumber
          }
        }
      }
    }
  }
`;
