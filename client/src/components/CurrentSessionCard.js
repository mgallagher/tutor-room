import React from 'react'
import { Button, Card } from 'semantic-ui-react'
import moment from 'moment'

import { FlexibleCard } from './QueueCard'

const CurrentSessionCard = ({ session, handleEndSession, handleRequeueSession, raised }) => {
  const { studentByStudentId, course, description, timeIn } = session
  return (
    <FlexibleCard raised={raised}>
      <Card.Content>
        <Card.Header>{`${studentByStudentId.preferredName} - ${course.number}`}</Card.Header>
        <Card.Meta>{moment(timeIn).fromNow()}</Card.Meta>
        <Card.Description>{description}</Card.Description>
      </Card.Content>
      <Card.Content extra>
        <div className="ui two buttons">
          <Button basic color="red" onClick={handleRequeueSession}>
            Requeue
          </Button>
          <Button basic color="green" onClick={handleEndSession}>
            End Session
          </Button>}
        </div>
      </Card.Content>
    </FlexibleCard>
  )
}

export default CurrentSessionCard
