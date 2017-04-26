import React from 'react';
import { Header, Table } from 'semantic-ui-react';
import moment from 'moment';

import { sessionReasons } from '../../constants';

export const QueueRow = ({ session, handleClick }) => {
  const { studentByStudentId, classByCrn, reason, description, timeIn } = session;
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
        {sessionReasons.get(reason)}
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
