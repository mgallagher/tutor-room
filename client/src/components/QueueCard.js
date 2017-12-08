import React from 'react'
import styled from 'styled-components'
import moment from 'moment'
import { Button, Card } from 'semantic-ui-react'

export const FlexibleCard = styled(Card)`
  margin: 5px 10px !important;
`

const QueueCard = ({ session, handleClaimClick, handleDeleteClick, raised }) => {
  const { studentByStudentId, course, description, timeIn } = session
  return (
    <FlexibleCard raised={raised}>
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
        <Card.Header>{studentByStudentId.preferredName}</Card.Header>
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
    </FlexibleCard>
  )
}

export default QueueCard
