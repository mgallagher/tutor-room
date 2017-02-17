import React, { Component } from 'react';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';


const ClassesForStudentQuery = gql`
  query ClassesForStudent($aNumber: String!) {
    allStudentCourses(condition:{aNumber:$aNumber}) {
      nodes {
        name
        instructor
      }
    }
  }
`;

const CourseRows = data => {

  return (
    <div>
    {
      data.allStudentCourses.nodes.map(course => (
        <p>{course.name} - {course.instructor}</p>)
      )
    }
    </div>
  );
};

class SelectClass extends Component {

  render() {
    if (this.props.data.loading) {
      console.log('loading', this.props);
      return (
        <div>
          <h2>Loading...</h2>
        </div>
      );
    } else {
      const {studentClassesByStudentId: classes} = this.props.data
      console.log('not loading', classes);
      return (
        <div>
          {CourseRows(this.props.data)}
        </div>
      );
    }
  }
}


const withData = graphql(ClassesForStudentQuery, {
  options: props => ({variables: { aNumber: props.params.aNumber }})
})

export default withData(SelectClass)
