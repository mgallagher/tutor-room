import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { graphql } from 'react-apollo'
import gql from 'graphql-tag'
import { Segment, List, Header, Icon } from 'semantic-ui-react'

const STUDENT_CLASSES_QUERY = gql`
  query {
    currentStudent {
      courses: studentCoursesByStudentId {
        nodes {
          course: courseByCourseId {
            id
            number
            title
          }
        }
      }
    }
  }
`

const LoadingSegment = styled(Segment)`min-height: 100px;`

const ClassRow = ({ course, onClick, active }) => {
  return (
    <List.Item active={active} onClick={onClick(course.id)}>
      <List.Content floated="left">
        <List.Header>{course.title}</List.Header>
        {course.number}
      </List.Content>
      <List.Content floated="right">
        <Icon fitted color={active ? 'green' : 'grey'} name="checkmark" size="large" />
      </List.Content>
    </List.Item>
  )
}

const SelectClass = ({ data, handleClassClick, selectedClass }) => {
  const { currentStudent, loading } = data
  if (loading) {
    return <LoadingSegment loading />
  }
  if (!currentStudent.courses.nodes.length) {
    return (
      <Segment>
        <h3>No Classes Found</h3>
      </Segment>
    )
  }
  return (
    <Segment>
      <Header as="h3" textAlign="center">Select your class</Header>
      <List selection verticalAlign="middle">
        {currentStudent.courses.nodes.map(studentClass => (
          <ClassRow
            key={studentClass.course.id}
            course={studentClass.course}
            onClick={handleClassClick}
            active={selectedClass === studentClass.course.id}
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
