import React from 'react'
import { Header, Table } from 'semantic-ui-react'
import moment from 'moment'

const PriorSessionRow = ({ session, handleClick }) => {
  const { studentByStudentId, tutor, course, description, timeIn, timeClaimed, timeOut } = session
  const timeWaitingMs = moment(timeClaimed).diff(timeIn)
  const sessionDurationMs = moment(timeOut).diff(timeClaimed)
  return (
    <Table.Row onClick={handleClick}>
      <Table.Cell>{studentByStudentId.preferredName}</Table.Cell>
      <Table.Cell>
        <Header as="h4">
          <Header.Content>{course.number}</Header.Content>
        </Header>
      </Table.Cell>
      <Table.Cell>{tutor.preferredName}</Table.Cell>
      <Table.Cell style={{ whiteSpace: 'nowrap' }}>{moment(timeIn).format('h:mm A')}</Table.Cell>
      <Table.Cell>{`${moment.duration(timeWaitingMs).minutes()} min.`}</Table.Cell>
      <Table.Cell>{`${moment.duration(sessionDurationMs).minutes()} min.`}</Table.Cell>
      <Table.Cell>{description}</Table.Cell>
    </Table.Row>
  )
}

export default PriorSessionRow
