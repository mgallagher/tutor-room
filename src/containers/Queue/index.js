import React, { PropTypes } from 'react';
import { Header, Grid, Table } from 'semantic-ui-react';
import styled from 'styled-components';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';

const QUEUE_QUERY = gql`
  query {
    allVisits(orderBy:TIME_IN_DESC) {
      totalCount
      nodes {
        studentByStudentId {
          fullName
        }
        classByCrn {
          instructor
          courseByCourseNumber {
            courseNumber
          }
        }
        reason
        description
        timeIn
        timeClaimed
        timeOut
      }
    }
  }
`;

const SqueezedWrapper = styled.div`
  min-width: 90%;
`;

const QueueRow = ({ visit }) => {
  const { studentByStudentId, classByCrn, reason, description } = visit;
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
        {reason}
      </Table.Cell>
      <Table.Cell>
        {description}
      </Table.Cell>
    </Table.Row>
  );
};

// goal - get rows of awaiting visits
export class Queue extends React.Component {
  render() {
    const { allVisits, loading } = this.props.data;
    return (
      <Grid centered columns={1} textAlign="left">
        <SqueezedWrapper>
          <Table celled>
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell>Name</Table.HeaderCell>
                <Table.HeaderCell>Class</Table.HeaderCell>
                <Table.HeaderCell>Reason</Table.HeaderCell>
                <Table.HeaderCell>Description</Table.HeaderCell>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {!loading &&
                allVisits.nodes.map(visit => <QueueRow visit={visit} />)}
            </Table.Body>
          </Table>
        </SqueezedWrapper>
      </Grid>
    );
  }
}

const withData = graphql(QUEUE_QUERY);

export default withData(Queue);
