import React from 'react';
import { Button, Card } from 'semantic-ui-react';
import moment from 'moment';

const CurrentSessionCard = ({ session, handleEndSession, handleRequeueSession, raised }) => {
  const { studentByStudentId, classByCrn, description, timeIn } = session;
  return (
    <Card raised={raised}>
      <Card.Content>
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
          <Button basic color="red" onClick={handleRequeueSession}>Requeue</Button>
          <Button basic color="green" onClick={handleEndSession}>End Session</Button>}
        </div>
      </Card.Content>
    </Card>
  );
};

export default CurrentSessionCard;
