import React from 'react'
import { Header, Table } from 'semantic-ui-react'
import moment from 'moment'

import { sessionReasons } from '../../constants'

const PriorSessionRow = ({ session, handleClick }) => {
  const { studentByStudentId, course, reason, description, timeIn } = session
  return (
    <Table.Row onClick={handleClick}>
      <Table.Cell>{studentByStudentId.preferredName}</Table.Cell>
      <Table.Cell>
        <Header as="h4">
          <Header.Content>{course.number}</Header.Content>
        </Header>
      </Table.Cell>
      <Table.Cell>{sessionReasons.get(reason)}</Table.Cell>
      <Table.Cell>{moment(timeIn).fromNow()}</Table.Cell>
      <Table.Cell>{description}</Table.Cell>
    </Table.Row>
  )
}

export default PriorSessionRow
