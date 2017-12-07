import React from 'react'
import { Card, Header, Table, Modal } from 'semantic-ui-react'
import styled from 'styled-components'
import { graphql } from 'react-apollo'
import { Redirect } from 'react-router-dom'
import { compose } from 'ramda'
import moment from 'moment'
import { socket } from '../../constants'

import CurrentSessionCard from './CurrentSessionCard'
import PriorSessionRow from './PriorSessionRow'
import QueueCard from '../../components/QueueCard'
import FinishSessionForm from './FinishSessionForm'
import { AllSessions } from '../../graphql/queries'
import { ClaimSession, FinishSession, DeleteSession, CopySession } from '../../graphql/mutations'

const SqueezedWrapper = styled.div`
  max-width: 80%;
  margin: 0 auto 30px;
`

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
    socket.on('queueUpdated', () => {
      console.log('Queue update message received!')
      this.props.data.refetch()
    })
  }

  emitQueueUpdate() {
    socket.emit('queueUpdated', this.props.data.currentTutor)
  }

  handleFormChange = (e, { name, value }) => this.setState({ [name]: value })
  handleModalClose = event => {
    this.setState({
      ...this.initialState
    })
  }

  handleClaimSession = session => async event => {
    const tutor = this.props.data.currentTutor
    await this.props.claimSession({
      variables: { sessionId: session.id, tutorId: tutor.id },
      optimisticResponse: {
        claimSession: {
          __typename: 'ClaimSessionPayload',
          session: {
            ...session,
            timeClaimed: new Date(),
            tutorId: tutor.id,
            tutor
          }
        }
      }
    })
    this.emitQueueUpdate()
  }

  handleEndSessionClick = session => async event => {
    await this.setState({ modalOpen: true, session: session })
  }

  handleEndSessionSubmit = async event => {
    event.preventDefault()
    await this.props.finishSession({
      variables: {
        sessionId: this.state.session.id,
        tag: this.state.sessionTag,
        notes: this.state.sessionNotes
      },
      optimisticResponse: {
        finishSession: {
          __typename: 'FinishSessionPayload',
          session: {
            ...this.state.session,
            timeOut: new Date()
          }
        }
      }
    })
    this.setState({
      ...this.initialState
    })
    this.emitQueueUpdate()
  }

  handleRequeueSession = session => async event => {
    await Promise.all([
      this.props.finishSession({
        variables: {
          sessionId: session.id,
          requeued: true
        },
        optimisticResponse: {
          finishSession: {
            __typename: 'FinishSessionPayload',
            session: {
              ...session,
              timeOut: new Date()
            }
          }
        }
      }),
      this.props.copySession({
        variables: {
          sessionId: session.id
        },
        updateQueries: {
          allSessions: (previousResult, { mutationResult }) => {
            return {
              ...previousResult,
              allSessions: {
                __typename: 'SessionsConnection',
                totalCount: previousResult.allSessions.totalCount + 1,
                nodes: [...previousResult.allSessions.nodes, mutationResult.data.copySession.session]
              }
            }
          }
        }
      })
    ])
    this.emitQueueUpdate()
  }

  handleDeleteSession = session => async event => {
    await this.props.deleteSession({
      variables: { sessionId: session.id },
      optimisticResponse: {
        deleteSession: {
          __typename: 'DeleteSessionPayload',
          session: {
            ...session
          }
        }
      },
      updateQueries: {
        allSessions: (previousResult, { mutationResult }) => {
          return {
            ...previousResult,
            allSessions: {
              ...previousResult.allSessions,
              nodes: previousResult.allSessions.nodes.filter(s => s.id !== session.id)
            }
          }
        }
      }
    })
    this.emitQueueUpdate()
  }

  render() {
    const { currentTutor, loading } = this.props.data
    var { allSessions } = this.props.data
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
    // TODO: Temporary workaround to keep non-tutors out of the queue manager
    if (localStorage.getItem('token') == null || (!loading && currentTutor === null)) {
      return <Redirect to="/logout" />
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
        {/* PRIOR SESSIONS */}
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
                  <Table.HeaderCell width={2}>Tutor</Table.HeaderCell>
                  <Table.HeaderCell width={1}>Time In</Table.HeaderCell>
                  <Table.HeaderCell width={1}>Waiting</Table.HeaderCell>
                  <Table.HeaderCell width={1}>Duration</Table.HeaderCell>
                  <Table.HeaderCell width={5}>Description</Table.HeaderCell>
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

const enhance = compose(
  graphql(AllSessions, {
    options: {
      variables: {
        startDate: moment
          .utc()
          .subtract(24, 'hours')
          .format('YYYY-M-DTHH:00:00')
      }
    }
  }),
  graphql(ClaimSession, { name: 'claimSession' }),
  graphql(FinishSession, { name: 'finishSession' }),
  graphql(DeleteSession, { name: 'deleteSession' }),
  graphql(CopySession, { name: 'copySession' })
)

export default enhance(Queue)
