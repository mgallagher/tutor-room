import React from 'react'
import { Card, Header, Table, Modal } from 'semantic-ui-react'
import styled from 'styled-components'
import { graphql } from 'react-apollo'
import { compose } from 'recompose'

import CurrentSessionCard from './CurrentSessionCard'
import PriorSessionRow from './PriorSessionRow'
import QueueCard from './QueueCard'
import FinishSessionForm from './FinishSessionForm'
import { AllSessions } from '../../graphql/queries'
import { ClaimSession, FinishSession, DeleteSession, CreateSession } from '../../graphql/mutations'

const SqueezedWrapper = styled.div`
  max-width: 80%;
  margin: 0 auto;
`

const enhance = compose(
  graphql(AllSessions),
  graphql(ClaimSession, { name: 'claimSession' }),
  graphql(FinishSession, { name: 'finishSession' }),
  graphql(DeleteSession, { name: 'deleteSession' }),
  graphql(CreateSession, { name: 'createSession' })
)

export class Queue extends React.Component {
  initialState = {
    modalOpen: false,
    session: {},
    sessionTag: null,
    sessionNotes: null
  }
  state = this.initialState

  handleFormChange = (e, { name, value }) => this.setState({ [name]: value })
  handleModalClose = event =>
    this.setState({
      ...this.initialState
    })

  handleClaimSession = session => async event => {
    await this.props.claimSession({
      // TODO: Add the actual tutor ID here
      variables: { sessionId: session.id, tutorId: 1 },
      optimisticResponse: {
        claimSession: {
          session: {
            ...session,
            timeClaimed: true
          }
        }
      }
    })
  }

  handleEndSessionClick = session => async event => {
    this.setState({ modalOpen: true, session: session })
  }

  handleEndSessionSubmit = event => {
    event.preventDefault()
    this.props.finishSession({
      variables: {
        sessionId: this.state.session.id,
        tag: this.state.sessionTag,
        notes: this.state.sessionNotes
      },
      optimisticResponse: {
        finishSession: {
          session: {
            ...this.state.session,
            timeOut: true
          }
        }
      }
    })
    this.setState({
      ...this.initialState
    })
  }

  handleRequeueSession = session => event => {
    this.props.finishSession({
      variables: {
        sessionId: session.id,
        requeued: true
      },
      optimisticResponse: {
        finishSession: {
          session: {
            ...session,
            timeOut: true
          }
        }
      }
    })
    this.props.createSession({
      variables: {
        aNumber: session.studentByStudentId.aNumber, // TODO: Just use the student id for this mutation
        crn: session.crn,
        reason: session.reason,
        description: session.description
      },
      updateQueries: {
        allSessions: (previousResult, { mutationResult }) => {
          return {
            allSessions: {
              nodes: [
                ...previousResult.allSessions.nodes,
                mutationResult.data.startSession.session
              ]
            }
          }
        }
      }
    })
  }

  handleDeleteSession = session => async event => {
    await this.props.deleteSession({
      variables: { sessionId: session.id },
      optimisticResponse: {
        deleteSession: {
          session: {
            ...session
          }
        }
      },
      updateQueries: {
        allSessions: (previousResult, { mutationResult }) => {
          return {
            allSessions: {
              nodes: previousResult.allSessions.nodes.filter(s => s.id !== session.id)
            }
          }
        }
      }
    })
  }

  render() {
    const { allSessions, loading } = this.props.data
    const unclaimedSession = ({ timeClaimed, timeOut }) => !timeClaimed && !timeOut
    const claimedSession = ({ timeClaimed, timeOut }) => timeClaimed && !timeOut
    const priorSession = ({ timeClaimed, timeOut }) => timeClaimed && timeOut

    return (
      <SqueezedWrapper>
        {/* CURRENT SESSIONS */}
        {this.state.modalOpen &&
          <Modal open onClose={this.handleModalClose} size="small">
            <FinishSessionForm
              onChange={this.handleFormChange}
              checked={this.state.sessionTag}
              onSubmit={this.handleEndSessionSubmit}
            />
          </Modal>}
        <Header as="h3" textAlign="left">
          Current Session(s)
        </Header>
        <Card.Group itemsPerRow={3}>
          {!loading &&
            allSessions.nodes
              .filter(claimedSession)
              .map((session, i) =>
                <CurrentSessionCard
                  handleRequeueSession={this.handleRequeueSession(session)}
                  handleEndSession={this.handleEndSessionClick(session)}
                  key={session.nodeId}
                  session={session}
                  raised={i === 0}
                />
              )}
        </Card.Group>

        {/* QUEUED SESSIONS */}
        <Header as="h3" textAlign="left">
          Queue
        </Header>
        <Card.Group itemsPerRow={3}>
          {!loading &&
            allSessions.nodes
              .filter(unclaimedSession)
              .map((session, i) =>
                <QueueCard
                  handleDeleteClick={this.handleDeleteSession(session)}
                  handleClaimClick={this.handleClaimSession(session)}
                  key={session.nodeId}
                  session={session}
                  raised={i === 0}
                />
              )}
        </Card.Group>
        {/* PAST SESSIONS */}
        <Header as="h3" textAlign="left">
          Prior Sessions
        </Header>
        <Table>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell width={3}>Name</Table.HeaderCell>
              <Table.HeaderCell width={3}>Class</Table.HeaderCell>
              <Table.HeaderCell width={3}>Reason</Table.HeaderCell>
              <Table.HeaderCell width={3}>Waiting</Table.HeaderCell>
              <Table.HeaderCell width={6}>Description</Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {!loading &&
              allSessions.nodes
                .filter(priorSession)
                .map(session => <PriorSessionRow key={session.nodeId} session={session} />)}
          </Table.Body>
        </Table>
      </SqueezedWrapper>
    )
  }
}

export default enhance(Queue)
