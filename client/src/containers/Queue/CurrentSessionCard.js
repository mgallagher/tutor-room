import React from 'react';
import { Button, Card, Label } from 'semantic-ui-react';
import moment from 'moment';

const CurrentSessionCard = ({ session, handleEndSessionClick, handleRequeueClick, raised }) => {
  const { studentByStudentId, classByCrn, description, timeIn } = session;
  return (
    <Card raised={raised}>
      <Card.Content>
        <Label color="blue" corner />
        <Card.Header>
          {`${studentByStudentId.fullName} - ${classByCrn.courseByCourseNumber.courseNumber}`}
        </Card.Header>
        <Card.Meta>
          {moment(timeIn).fromNow()}
        </Card.Meta>
        <Card.Description>
          {description}
        </Card.Description>
      </Card.Content>
      <Card.Content extra>
        <div className="ui two buttons">
          <Button basic color="red" onClick={handleRequeueClick}>Requeue</Button>
          <Button basic color="green" onClick={handleEndSessionClick}>End Session</Button>
        </div>
      </Card.Content>
    </Card>
  );
};

export default CurrentSessionCard;
