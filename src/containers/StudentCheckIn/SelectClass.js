import React, { Component, PropTypes } from 'react';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import Button from 'react-toolbox/lib/button/Button';
import { ListItem } from 'react-toolbox/lib/list/ListItem';
import { List } from 'react-toolbox/lib/list/List';


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

const CREATE_VISIT_MUTATION = gql`
  mutation startVisit($studentId: Int!, $crn:Int!, $description:String) {
    createVisit(input: {visit:{studentId:$studentId, crn:$crn, description:$description, }}) {
      visit {
        nodeId
        id
        description
      }
    }
  }
`;

export const ClassRow = ({ course, onClick }) => {
  const { name, instructor, crn } = course
  return (
    <List>
      <ListItem
        caption={name}
        legend={instructor}
        onClick={onClick(crn)}
      />
    </List>
  );
};

const CourseRows = ({ studentCourses, onClick }) => {
  return (
    <div>
      {studentCourses.map(course => (
        <div key={course.crn}>
          <p>{course.name} - {course.instructor}</p>
          <Button label="Select" raised onClick={() => onClick(course.crn)} />
        </div>
      ))}
    </div>
  );
};

class SelectClass extends Component {
  constructor(props) {
    super(props);
    this.handleOnClick = this.handleOnClick.bind(this);
  }

  async handleOnClick(crn) {
    console.log(crn, 'clicked');
    const studentId = this.props.data.allStudentCourses.nodes[0].studentId;
    await this.props.mutate({ variables: { studentId: studentId, crn: crn } });
  }

  render() {
    const loading = this.props.data.loading;

    if (loading) {
      console.log('loading', this.props);
      return (
        <div>
          <h2>Loading...</h2>
        </div>
      );
    }
    const studentCourses = this.props.data.allStudentCourses.nodes;
    if (studentCourses.length) {
      return (
        <div>
          {CourseRows({ studentCourses, onClick: this.handleOnClick })}
        </div>
      );
    }
    return (
      <div>
        <h2>Student not found</h2>
      </div>
    );
  }
}

SelectClass.propTypes = {
  loading: PropTypes.bool,
  allStudentCourses: PropTypes.shape({
    nodes: PropTypes.array.isRequired
  })
};

const withData = graphql(STUDENT_CLASSES_QUERY, {
  options: props => ({ variables: { aNumber: props.params.aNumber } })
});

const withMutation = graphql(CREATE_VISIT_MUTATION);

export default withMutation(withData(SelectClass));
