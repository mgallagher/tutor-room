import React from 'react'
import { Card, Header, Table, Modal } from 'semantic-ui-react'
import styled from 'styled-components'
import { graphql } from 'react-apollo'
import { Redirect } from 'react-router-dom'
import { compose } from 'ramda'

import CurrentSessionCard from './CurrentSessionCard'
import PriorSessionRow from './PriorSessionRow'
import QueueCard from './QueueCard'
import FinishSessionForm from './FinishSessionForm'
import { AllSessions } from '../../graphql/queries'
import { ClaimSession, FinishSession, DeleteSession, CopySession } from '../../graphql/mutations'

const SqueezedWrapper = styled.div`
  max-width: 80%;
  margin: 0 auto 30px;
`

const enhance = compose(
  graphql(AllSessions),
  graphql(ClaimSession, { name: 'claimSession' }),
  graphql(FinishSession, { name: 'finishSession' }),
  graphql(DeleteSession, { name: 'deleteSession' }),
  graphql(CopySession, { name: 'copySession' })
)

export class Queue extends React.Component {
  initialState = {
    modalOpen: false,
    session: {},
    sessionTag: null,
    sessionNotes: null
  }
  state = this.initialState

  componentWillMount() {
    const token = this.props.match.params.token
    if (token !== undefined) {
      localStorage.setItem('token', token)
    }
  }

  handleFormChange = (e, { name, value }) => this.setState({ [name]: value })
  handleModalClose = event => {
    this.setState({
      ...this.initialState
    })
  }

  handleClaimSession = session => async event => {
    const tutorId = this.props.data.currentTutor.id
    await this.props.claimSession({
      variables: { sessionId: session.id, tutorId: tutorId },
      optimisticResponse: {
        claimSession: {
          session: {
            ...session,
            timeClaimed: true,
            tutorId: tutorId
          }
        }
      }
    })
    this.props.data.refetch()
  }

  handleEndSessionClick = session => async event => {
    await this.setState({ modalOpen: true, session: session })
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
    this.props.data.refetch()
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
    this.props.copySession({
      variables: {
        sessionId: session.id
      },
      updateQueries: {
        allSessions: (previousResult, { mutationResult }) => {
          return {
            allSessions: {
              nodes: [...previousResult.allSessions.nodes, mutationResult.data.copySession.session]
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
    const { allSessions, currentTutor, loading } = this.props.data
    const mySession = ({ tutorId }) => currentTutor.id === tutorId
    const claimedSession = ({ timeClaimed, timeOut }) => timeClaimed && !timeOut
    const unclaimedSession = ({ timeClaimed, timeOut }) => !timeClaimed && !timeOut
    const priorSession = ({ timeClaimed, timeOut }) => timeClaimed && timeOut

    const currentSessions = allSessions => allSessions.nodes.filter(claimedSession).filter(mySession)
    const queuedSessions = allSessions =>
      allSessions.nodes.filter(unclaimedSession).sort((a, b) => new Date(a.timeIn) - new Date(b.timeIn))
    const priorSessions = allSessions => allSessions.nodes.filter(priorSession)
    const token = this.props.match.params.token
    if (token != null) {
      return <Redirect to="/queue" />
    }
    return (
      <SqueezedWrapper>
        {/* CURRENT SESSIONS */}
        {this.state.modalOpen && (
          <Modal open onClose={this.handleModalClose} size="small" closeIcon>
            <FinishSessionForm
              onChange={this.handleFormChange}
              checked={this.state.sessionTag}
              onSubmit={this.handleEndSessionSubmit}
            />
          </Modal>
        )}
        {!loading && (
          <Header as="h3" disabled={currentSessions(allSessions).length === 0} textAlign="left">
            {currentSessions(allSessions).length > 0 ? 'Current Session' : 'No Current Session'}
          </Header>
        )}

        <Card.Group itemsPerRow={3} stackable>
          {!loading &&
            currentSessions(allSessions).map((session, i) => (
              <CurrentSessionCard
                handleRequeueSession={this.handleRequeueSession(session)}
                handleEndSession={this.handleEndSessionClick(session)}
                key={session.nodeId}
                session={session}
                raised={i === 0}
              />
            ))}
        </Card.Group>

        {/* QUEUED SESSIONS */}
        {!loading && (
          <Header as="h3" disabled={queuedSessions(allSessions).length === 0} textAlign="left">
            {queuedSessions(allSessions).length > 0 ? 'Queue' : 'Queue Empty'}
          </Header>
        )}
        <Card.Group itemsPerRow={3} stackable>
          {!loading &&
            queuedSessions(allSessions).map((session, i) => (
              <QueueCard
                handleDeleteClick={this.handleDeleteSession(session)}
                handleClaimClick={this.handleClaimSession(session)}
                key={session.nodeId}
                session={session}
                raised={i === 0}
              />
            ))}
        </Card.Group>
        {/* PAST SESSIONS */}
        {!loading && (
          <Header as="h3" disabled={priorSessions(allSessions).length === 0} textAlign="left">
            {priorSessions(allSessions).length > 0 ? 'Prior Sessions' : 'No Prior Sessions'}
          </Header>
        )}
        {!loading &&
          priorSessions(allSessions).length > 0 && (
            <Table>
              <Table.Header>
                <Table.Row>
                  <Table.HeaderCell width={3}>Name</Table.HeaderCell>
                  <Table.HeaderCell width={1}>Course</Table.HeaderCell>
                  <Table.HeaderCell width={2}>Reason</Table.HeaderCell>
                  <Table.HeaderCell width={2}>Waiting</Table.HeaderCell>
                  <Table.HeaderCell width={2}>Duration</Table.HeaderCell>
                  <Table.HeaderCell width={6}>Description</Table.HeaderCell>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {priorSessions(allSessions).map(session => (
                  <PriorSessionRow key={session.nodeId} session={session} />
                ))}
              </Table.Body>
            </Table>
          )}
      </SqueezedWrapper>
    )
  }
}

export default enhance(Queue)
