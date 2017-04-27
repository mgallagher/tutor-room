import React from 'react';
import { Button, Card, Icon} from 'semantic-ui-react';
import moment from 'moment';

const QueueCard = ({ session, handleClaimClick, handleDeleteClick, raised }) => {
  const { studentByStudentId, classByCrn, description, timeIn } = session;
  return (
    <Card raised={raised}>
      <Card.Content>
        {/*<Label color="blue" attached="top right" />*/}
        <Button size="tiny" floated="right" onClick={handleDeleteClick} basic icon>
          <Icon color="red" name="delete" />
        </Button>
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
          <Button basic color="green" onClick={handleClaimClick}>Claim</Button>
        </div>
      </Card.Content>
    </Card>
  );
};

export default QueueCard;
