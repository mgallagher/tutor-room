import React from 'react'
import { Header, Table } from 'semantic-ui-react'
import moment from 'moment'

const PriorSessionRow = ({ session, handleClick }) => {
  const { studentByStudentId, course, description, timeIn, timeClaimed, timeOut, tutor } = session
  const timeWaitingMs = moment(timeIn).diff(timeClaimed)
  const sessionDurationMs = moment(timeClaimed).diff(timeOut)
  return (
    <Table.Row onClick={handleClick}>
      <Table.Cell>{studentByStudentId.preferredName}</Table.Cell>
      <Table.Cell>
        <Header as="h4">
          <Header.Content>{course.number}</Header.Content>
        </Header>
      </Table.Cell>
      <Table.Cell>{tutor.preferredName}</Table.Cell>
      <Table.Cell>{moment.duration(timeWaitingMs).humanize()}</Table.Cell>
      <Table.Cell>{moment.duration(sessionDurationMs).humanize()}</Table.Cell>
      <Table.Cell>{description}</Table.Cell>
    </Table.Row>
  )
}

export default PriorSessionRow
