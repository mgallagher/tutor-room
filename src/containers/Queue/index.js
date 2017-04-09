import React, { PropTypes } from 'react';
import { Button, Card, Header, Grid, Table } from 'semantic-ui-react';
import styled from 'styled-components';
import { graphql } from 'react-apollo';
import { compose } from 'recompose';
import gql from 'graphql-tag';
import moment from 'moment';

import { visitReasons } from '../../constants';

const QUEUE_QUERY = gql`
  query {
    allVisits(orderBy:TIME_IN_DESC) {
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

const CLAIM_VISIT_MUTATION = gql`
  mutation claimVisit($visitId: Int!, $tutorId:Int!) {
    claimVisit(input:{visitId: $visitId, tutorId:$tutorId}) {
      visit {
        nodeId
        id
        timeClaimed
        timeOut
        description
      }
    }
  }
`;

const FINISH_VISIT_MUTATION = gql`
  mutation finishVisit($visitId: Int!) {
    finishVisit(input:{visitId: $visitId}) {
      visit {
        nodeId
        id
        timeClaimed
        timeOut
        description
      }
    }
  }
`;

const SqueezedWrapper = styled.div`
  max-width: 90%;
`;

const enhance = compose(
  graphql(QUEUE_QUERY),
  graphql(CLAIM_VISIT_MUTATION, { name: 'claimVisit' }),
  graphql(FINISH_VISIT_MUTATION, { name: 'finishVisit' })
);

const QueueRow = ({ visit, handleClick }) => {
  const { studentByStudentId, classByCrn, reason, description, timeIn } = visit;
  return (
    <Table.Row onClick={handleClick}>
      <Table.Cell>
        {studentByStudentId.fullName}
      </Table.Cell>
      <Table.Cell>
        <Header as="h4">
          <Header.Content>
            {classByCrn.courseByCourseNumber.courseNumber}
            <Header.Subheader>{classByCrn.instructor}</Header.Subheader>
          </Header.Content>
        </Header>
      </Table.Cell>
      <Table.Cell>
        {visitReasons.get(reason)}
      </Table.Cell>
      <Table.Cell>
        {moment(timeIn).fromNow()}
      </Table.Cell>
      <Table.Cell>
        {description}
      </Table.Cell>
    </Table.Row>
  );
};

export class Queue extends React.Component {
  handleQueueSelect = visit =>
    async event => {
      await this.props.claimVisit({
        variables: { visitId: visit.id, tutorId: 1 },
        optimisticResponse: {
          claimVisit: {
            visit: {
              ...visit,
              timeClaimed: true
            },
            __typename: 'ClaimVisitPayload'
          }
        }
      });
    };

  handleCurrentVisitSelect = visit =>
    async event => {
      await this.props.finishVisit({
        variables: { visitId: visit.id },
        optimisticResponse: {
          finishVisit: {
            visit: {
              ...visit,
              timeOut: true
            }
          }
        }
      });
    };

  render() {
    const { allVisits, loading } = this.props.data;
    const unclaimedVisit = ({ timeClaimed, timeOut }) =>
      !timeClaimed && !timeOut;
    const claimedVisit = ({ timeClaimed, timeOut }) => timeClaimed && !timeOut;
    const priorVisit = ({ timeClaimed, timeOut }) => timeClaimed && timeOut;

    return (
      <Grid centered columns={1} textAlign="left">
        <SqueezedWrapper>
          {/* Current */}
          <Header as="h4" textAlign="left">Current Session(s)</Header>
          <Table selectable>
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
                allVisits.nodes
                  .filter(claimedVisit)
                  .map(visit => (
                    <QueueRow
                      handleClick={this.handleCurrentVisitSelect(visit)}
                      key={visit.nodeId}
                      visit={visit}
                    />
                  ))}
            </Table.Body>
          </Table>
          {/* QUEUE */}
          <Header as="h4" textAlign="left">Queue</Header>
          <Table selectable>
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
                allVisits.nodes
                  .filter(unclaimedVisit)
                  .map(visit => (
                    <QueueRow
                      handleClick={this.handleQueueSelect(visit)}
                      key={visit.nodeId}
                      visit={visit}
                    />
                  ))}
            </Table.Body>
          </Table>
          {/* VISITS */}
          <Header as="h4" textAlign="left">Prior Sessions</Header>
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
                allVisits.nodes
                  .filter(priorVisit)
                  .map(visit => <QueueRow key={visit.nodeId} visit={visit} />)}
            </Table.Body>
          </Table>
        </SqueezedWrapper>
      </Grid>
    );
  }
}

export default enhance(Queue);
