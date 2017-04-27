import React from 'react';
import PropTypes from 'prop-types';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import { Segment, List, Header, Icon } from 'semantic-ui-react';

const STUDENT_CLASSES_QUERY = gql`
  query ClassesForStudent($aNumber: String!) {
    allStudentCourses(condition:{aNumber:$aNumber}) {
      nodes {
        studentId
        name
        instructor
        crn
      }
    }
  }
`;

export const ClassRow = ({ course, onClick, active }) => {
  const { name, instructor, crn } = course;
  return (
    <List.Item active={active} onClick={onClick(crn)}>
      <List.Content floated="left">
        <List.Header>{name}</List.Header>
        {instructor}
      </List.Content>
      <List.Content floated="right">
        <Icon fitted color={active ? 'green' : 'grey'} name="checkmark" size="large" />
      </List.Content>
    </List.Item>
  );
};

const SelectClass = ({ data, handleClassClick, selectedClass }) => {
  const { allStudentCourses, loading } = data;
  if (loading) {
    return <Segment loading />;
  }
  const studentCourses = allStudentCourses.nodes;
  if (!studentCourses.length) {
    return (
      <Segment>
        <h3>No Classes Found</h3>
      </Segment>
    );
  }
  return (
    <Segment>
      <Header as="h3">Select your class</Header>
      <List selection verticalAlign="middle">
        {studentCourses.map(course => (
          <ClassRow
            key={course.crn}
            course={course}
            onClick={handleClassClick}
            active={selectedClass === course.crn}
          />
        ))}
      </List>
    </Segment>
  );
};

const withData = graphql(STUDENT_CLASSES_QUERY, {
  options: props => ({ variables: { aNumber: props.aNumber } }),
});

SelectClass.propTypes = {
  data: PropTypes.object.isRequired,
  handleClassClick: PropTypes.func.isRequired,
  selectedClass: PropTypes.number,
};

export default withData(SelectClass);
