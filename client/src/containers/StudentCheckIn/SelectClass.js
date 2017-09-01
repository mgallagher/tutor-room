import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { graphql } from 'react-apollo'
import gql from 'graphql-tag'
import { Segment, List, Header, Icon } from 'semantic-ui-react'

// const STUDENT_CLASSES_QUERY = gql`
//   query ClassesForStudent($aNumber: String!) {
//     allStudentCourses(condition:{aNumber:$aNumber}) {
//       nodes {
//         studentId
//         name
//         instructor
//         crn
//       }
//     }
//   }
// `;

const STUDENT_CLASSES_QUERY = gql`
  query {
    currentStudent {
      courses: studentCoursesByStudentId {
        nodes {
          courseByCrn {
            crn
            number
            title
          }
        }
      }
    }
  }
`

const LoadingSegment = styled(Segment)`min-height: 100px;`

const ClassRow = ({ courseByCrn, onClick, active }) => {
  return (
    <List.Item active={active} onClick={onClick(courseByCrn.crn)}>
      <List.Content floated="left">
        <List.Header>{courseByCrn.title}</List.Header>
        {courseByCrn.number}
      </List.Content>
      <List.Content floated="right">
        <Icon fitted color={active ? 'green' : 'grey'} name="checkmark" size="large" />
      </List.Content>
    </List.Item>
  )
}

const SelectClass = ({ data, handleClassClick, selectedClass }) => {
  const { currentStudent, loading } = data
  console.log(currentStudent)
  if (loading) {
    return <LoadingSegment loading />
  }
  console.log('hellooooo')
  if (!currentStudent.classes.nodes.length) {
    return (
      <Segment>
        <h3>No Classes Found</h3>
      </Segment>
    )
  }
  return (
    <Segment>
      <Header as="h3">Select your class</Header>
      <List selection verticalAlign="middle">
        {currentStudent.classes.nodes.map(course => (
          <ClassRow
            key={course.crn}
            course={course}
            onClick={handleClassClick}
            active={selectedClass === course.crn}
          />
        ))}
      </List>
    </Segment>
  )
}

SelectClass.propTypes = {
  data: PropTypes.object.isRequired,
  handleClassClick: PropTypes.func.isRequired,
  selectedClass: PropTypes.number
}

export default graphql(STUDENT_CLASSES_QUERY)(SelectClass)
