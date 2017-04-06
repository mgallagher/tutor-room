import React, { PropTypes } from 'react';
import { Header, Grid, Table } from 'semantic-ui-react';
import styled from 'styled-components';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import moment from 'moment';

import { visitReasons } from '../../constants';

const QUEUE_QUERY = gql`
  query {
    allVisits(orderBy:TIME_IN_DESC) {
      totalCount
      nodes {
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

const SqueezedWrapper = styled.div`
  max-width: 90%;
`;

const QueueRow = ({ visit }) => {
  const { studentByStudentId, classByCrn, reason, description, timeIn } = visit;
  return (
    <Table.Row>
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
  render() {
    const { allVisits, loading } = this.props.data;
    return (
      <Grid centered columns={1} textAlign="left">
        <SqueezedWrapper>
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
                allVisits.nodes.map(visit => (
                  <QueueRow key={visit.nodeId} visit={visit} />
                ))}
            </Table.Body>
          </Table>
        </SqueezedWrapper>
      </Grid>
    );
  }
}

const withData = graphql(QUEUE_QUERY);

export default withData(Queue);
