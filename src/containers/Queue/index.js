import React, { PropTypes } from 'react';
import { Button, Card, Header, Icon, Grid, Label, Table } from 'semantic-ui-react';
import styled from 'styled-components';
import { graphql } from 'react-apollo';
import { compose } from 'recompose';
import gql from 'graphql-tag';
import moment from 'moment';

import QueueRow from './Row';

const sessionFragment = gql`
  fragment SessionFragment on Session {
  id
  nodeId
  reason
  studentByStudentId {
    fullName
  }
}
`;

const QUEUE_QUERY = gql`
  query allSessions {
    allSessions(orderBy:TIME_IN_DESC) {
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

const CLAIM_SESSION_MUTATION = gql`
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

const FINISH_SESSION_MUTATION = gql`
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

const DELETE_SESSION_MUTATION = gql`
  mutation deleteSession($sessionId: Int!) {
    deleteSession(input:{sessionId: $sessionId}) {
      session {
        nodeId
        id
      }
    }
  }
`;

const SqueezedWrapper = styled.div`
  max-width: 80%;
  margin: 0 auto;
`;

const enhance = compose(
  graphql(QUEUE_QUERY),
  graphql(CLAIM_SESSION_MUTATION, { name: 'claimSession' }),
  graphql(FINISH_SESSION_MUTATION, { name: 'finishSession' }),
  graphql(DELETE_SESSION_MUTATION, { name: 'deleteSession' })
);

const QueueCard = ({ session, handleClaimClick, handleDeleteClick, raised }) => {
  const { studentByStudentId, classByCrn, reason, description, timeIn } = session;
  return (
    <Card raised={raised}>
      <Card.Content>
        {/*<Label color="blue" attached="top right" />*/}
        <Button size="tiny" floated="right" onClick={handleDeleteClick} basic icon>
          <Icon color="red" name="delete" />
        </Button>
        <Card.Header>
          {`${studentByStudentId.fullName} - ${classByCrn.courseByCourseNumber.courseNumber}`}
        </Card.Header>
        <Card.Meta>
          {moment(timeIn).fromNow()}
        </Card.Meta>
        <Card.Description>
          {description}
        </Card.Description>
      </Card.Content>
      <Card.Content extra>
        <div className="ui two buttons">
          <Button basic color="green" onClick={handleClaimClick}>Claim</Button>
        </div>
      </Card.Content>
    </Card>
  );
};

const CurrentSessionCard = ({ session, handleClick, raised }) => {
  const { studentByStudentId, classByCrn, description, timeIn } = session;
  return (
    <Card raised={raised}>
      <Card.Content>
        <Label color="blue" corner />
        <Card.Header>
          {`${studentByStudentId.fullName} - ${classByCrn.courseByCourseNumber.courseNumber}`}
        </Card.Header>
        <Card.Meta>
          {moment(timeIn).fromNow()}
        </Card.Meta>
        <Card.Description>
          {description}
        </Card.Description>
      </Card.Content>
      <Card.Content extra>
        <div className="ui two buttons">
          <Button basic color="red" onClick={handleClick}>Requeue</Button>
          <Button basic color="green" onClick={handleClick}>End Session</Button>
        </div>
      </Card.Content>
    </Card>
  );
};

export class Queue extends React.Component {
  handleQueueSelect = session => async event => {
    await this.props.claimSession({
      variables: { sessionId: session.id, tutorId: 1 },
      optimisticResponse: {
        claimSession: {
          session: {
            ...session,
            timeClaimed: true,
          },
          __typename: 'ClaimSessionPayload',
        },
      },
    });
  };

  handleEndSessionClick = session => async event => {
    await this.props.finishSession({
      variables: { sessionId: session.id },
      optimisticResponse: {
        finishSession: {
          session: {
            ...session,
            timeOut: true,
          },
        },
      },
    });
  };

  handleRequeueClick = session => event => {
    console.log('requeue', session);
  };

  handleDeleteSession = session => async event => {
    await this.props.deleteSession({
      variables: { sessionId: session.id },
      optimisticResponse: {
        deleteSession: {
          session: {
            ...session,
          },
        },
      },
      updateQueries: {
        allSessions: (previousResult, { mutationResult }) => {
          return {
            allSessions: {
              nodes: previousResult.allSessions.nodes.filter(s => s.id !== session.id),
            },
          };
        },
      },
    });
  };

  render() {
    const { allSessions, loading } = this.props.data;
    const unclaimedSession = ({ timeClaimed, timeOut }) => !timeClaimed && !timeOut;
    const claimedSession = ({ timeClaimed, timeOut }) => timeClaimed && !timeOut;
    const priorSession = ({ timeClaimed, timeOut }) => timeClaimed && timeOut;

    return (
      <SqueezedWrapper>
        {/* CURRENT SESSIONS */}
        <Header as="h3" textAlign="left">Current Session(s)</Header>
        <Card.Group itemsPerRow={3}>
          {!loading &&
            allSessions.nodes
              .filter(claimedSession)
              .map((session, i) => (
                <CurrentSessionCard
                  handleRequeueClick={this.handleRequeueClick(session)}
                  handleEndSessionClick={this.handleEndSessionClick(session)}
                  key={session.nodeId}
                  session={session}
                  raised={i === 0}
                />
              ))}
        </Card.Group>

        {/* QUEUED SESSIONS */}
        <Header as="h3" textAlign="left">Queue</Header>
        <Card.Group itemsPerRow={3}>
          {!loading &&
            allSessions.nodes
              .filter(unclaimedSession)
              .map((session, i) => (
                <QueueCard
                  handleDeleteClick={this.handleDeleteSession(session)}
                  handleClaimClick={this.handleQueueSelect(session)}
                  key={session.nodeId}
                  session={session}
                  raised={i === 0}
                />
              ))}
        </Card.Group>
        {/* PAST SESSIONS */}
        <Header as="h3" textAlign="left">Prior Sessions</Header>
        <Table>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell width={3}>Name</Table.HeaderCell>
              <Table.HeaderCell width={3}>Class</Table.HeaderCell>
              <Table.HeaderCell width={3}>Reason</Table.HeaderCell>
              <Table.HeaderCell width={3}>Waiting</Table.HeaderCell>
              <Table.HeaderCell width={6}>Description</Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {!loading &&
              allSessions.nodes
                .filter(priorSession)
                .map(session => <QueueRow key={session.nodeId} session={session} />)}
          </Table.Body>
        </Table>
      </SqueezedWrapper>
    );
  }
}

export default enhance(Queue);
