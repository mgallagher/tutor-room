import React from 'react'
import styled from 'styled-components'
import { graphql } from 'react-apollo'
import { compose } from 'ramda'
import { Redirect } from 'react-router-dom'
import moment from 'moment'
import { Grid, Header, Label, Icon } from 'semantic-ui-react'

import SelectClass from './SelectClass'
import EnterDescription from './EnterDescription'
import { StartSession } from '../../graphql/mutations'
import { AverageWait } from '../../graphql/queries'

const SqueezedColumn = styled(Grid.Column)`max-width: 450px;`

const FlexCenter = styled.div`
  display: flex;
  justify-content: center;
`

const enhance = compose(graphql(StartSession), graphql(AverageWait))

// TODO: Make this a separate component
const AverageWaitLabel = ({ data }) => {
  const { latestAverageWait, loading } = data
  const duration = moment.duration({
    hours: latestAverageWait ? latestAverageWait.hours : 0,
    minutes: latestAverageWait ? latestAverageWait.minutes : 0
  })
  return (
    <Label size="big">
      <Icon name="wait" />
      Average wait:
      <Label.Detail>
        {loading ? '...' : duration.asMinutes() ? `${duration.asMinutes()} min.` : 'No wait!'}
      </Label.Detail>
    </Label>
  )
}

export const AverageWaitWithData = graphql(AverageWait)(AverageWaitLabel)

class StudentCheckIn extends React.Component {
  initialState = {
    courseId: null,
    description: '',
    reason: '',
    submitted: false,
    redirect: false
  }
  state = this.initialState

  componentWillMount() {
    const token = this.props.match.params.token
    if (token !== undefined) {
      localStorage.setItem('token', token)
    }
  }

  handleChange = (e, { name, value }) => this.setState({ [name]: value })
  handleClassSelect = courseId => event => this.setState({ courseId: courseId })
  handleSubmit = async event => {
    event.preventDefault()
    const { courseId, description, reason } = this.state
    await this.props.mutate({
      variables: { courseId, description, reason }
    })
    this.setState({ submitted: true })
    setTimeout(() => {
      this.setState({ redirect: true })
    }, 3000)
  }

  render() {
    const token = this.props.match.params.token
    if (token != null) {
      return <Redirect to="/checkin" />
    } else if (this.state.redirect) {
      return <Redirect to="/logout" />
    }
    return (
      <Grid centered columns={1} textAlign="left">
        {!this.state.submitted && (
          <SqueezedColumn>
            <FlexCenter>
              {!this.props.data.loading &&
                this.props.data.latestAverageWait && <AverageWaitWithData data={this.props.data} />}
            </FlexCenter>
            <SelectClass handleClassClick={this.handleClassSelect} selectedClass={this.state.courseId} />
            <EnterDescription
              onChange={this.handleChange}
              onSubmit={this.handleSubmit}
              checked={this.state.reason}
            />
          </SqueezedColumn>
        )}
        {this.state.submitted && <Header as="h2">Thank you!</Header>}
      </Grid>
    )
  }
}

export default enhance(StudentCheckIn)
