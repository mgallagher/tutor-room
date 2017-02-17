import React, { PropTypes } from 'react';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';


const STUDENT_CLASSES_QUERY = gql`
  query ClassesForStudent($aNumber: String!) {
    allStudentCourses(condition:{aNumber:$aNumber}) {
      nodes {
        name
        instructor
      }
    }
  }
`;

const CourseRows = studentCourses => {

  return (
    <div>
    {
      studentCourses.map(course => (
        <p>{course.name} - {course.instructor}</p>)
      )
    }
    </div>
  );
};

function SelectClass(props) {
  const loading = props.data.loading

  if (loading) {
    console.log('loading', props);
    return (
      <div>
        <h2>Loading...</h2>
      </div>
    );
  }
  const studentCourses = props.data.allStudentCourses.nodes
  if (studentCourses.length) {
    return (
      <div>
        {CourseRows(studentCourses)}
      </div>
    );
  }
  return (
    <div>
      <h2>Student not found</h2>
    </div>
  )
}

SelectClass.propTypes = {
  loading: PropTypes.bool.isRequired,
  allStudentCourses: PropTypes.shape({
    nodes: PropTypes.array.isRequired,
  })
};


const withData = graphql(STUDENT_CLASSES_QUERY, {
  options: props => ({variables: { aNumber: props.params.aNumber }})
})

export default withData(SelectClass)
