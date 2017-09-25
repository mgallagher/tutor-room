import React from 'react'
import { Button, Card } from 'semantic-ui-react'
import moment from 'moment'

const QueueCard = ({ session, handleClaimClick, handleDeleteClick, raised }) => {
  const { studentByStudentId, course, description, timeIn } = session
  return (
    <Card raised={raised}>
      <Card.Content>
        <Button
          basic
          circular
          color="red"
          size="mini"
          floated="right"
          icon="delete"
          onClick={handleDeleteClick}
        />
        <Card.Header>
          {studentByStudentId.preferredName}
        </Card.Header>
        <Card.Header>{`${course.number}`}</Card.Header>
        <Card.Meta>{moment(timeIn).fromNow()}</Card.Meta>
        <Card.Description>{description}</Card.Description>
      </Card.Content>
      <Card.Content extra>
        <div className="ui two buttons">
          <Button basic color="green" onClick={handleClaimClick}>
            Claim
          </Button>
        </div>
      </Card.Content>
    </Card>
  )
}

export default QueueCard
