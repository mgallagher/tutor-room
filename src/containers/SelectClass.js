import React, { Component } from 'react';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';


const ClassesForStudentQuery = gql`
  query ClassesForStudent($aNumber: String!) {
    studentByANumber(aNumber: $aNumber) {
      studentClassesByStudentId {
        nodes {
          classByClassCrn {
            instructor
            courseByCourseNumber {
              name
            }
          }
        }
      }
    }
  }
`;



class SelectClass extends Component {
  constructor(props) {
    console.log('select class');
    super(props);
  }

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
          <div>hi</div>
        </div>
      );
    }
  }
}


const withData = graphql(ClassesForStudentQuery, {
  options: props => ({variables: { aNumber: props.params.aNumber }})
})

export default withData(SelectClass)
