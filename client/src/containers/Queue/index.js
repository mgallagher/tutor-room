import React from 'react'
import { Header, Table, Modal, Label, Segment } from 'semantic-ui-react'
import styled from 'styled-components'
import { graphql } from 'react-apollo'
import { Redirect } from 'react-router-dom'
import { compose } from 'ramda'
import moment from 'moment'
import { socket } from '../../constants'

import CurrentSessionCard from '../../components/CurrentSessionCard'
import PriorSessionRow from './PriorSessionRow'
import QueueCard from '../../components/QueueCard'
import FinishSessionForm from './FinishSessionForm'
import { AllSessions, Sessions } from '../../graphql/queries'
import { ClaimSession, FinishSession, DeleteSession, CopySession } from '../../graphql/mutations'

const SqueezedWrapper = styled.div`
  max-width: 80%;
  margin: 0 auto 30px;

  @media (max-width: 767px) {
    max-width: 90%;
    margin: 0 auto 20px;
  }
`

const CardSegment = styled(Segment)`
  display: flex;
  flex-direction: column;
  padding: 0px !important;
  & > .ui.label {
    display: flex;
    align-items: center;
    border-radius: 0px;
    width: 100%;
    height: 50px;
  }
  & > .ui.card {
    margin: 10px !important;
  }
  & > .ui.card.raised {
    margin: 10px !important;
  }
`

const CardContainer = styled.div`
  display: flex;
  min-height: 100px;
  padding: 10px;
  flex-wrap: wrap;
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
      },
      updateQueries: {
        Sessions: (previousResult, { mutationResult }) => {
          console.log(mutationResult)
          return {
            ...previousResult,
            currentSessions: {
              __typename: 'SessionsConnection',
              totalCount: previousResult.currentSessions.totalCount + 1,
              nodes: [...previousResult.currentSessions.nodes, mutationResult.data.claimSession.session]
            }
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
          Sessions: (previousResult, { mutationResult }) => {
            return {
              ...previousResult,
              queuedSessions: {
                __typename: 'SessionsConnection',
                totalCount: previousResult.queuedSessions.totalCount + 1,
                nodes: [...previousResult.queuedSessions.nodes, mutationResult.data.copySession.session]
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
        Sessions: (previousResult, { mutationResult }) => {
          return {
            ...previousResult,
            queuedSessions: {
              totalCount: previousResult.queuedSessions.totalCount - 1,
              nodes: previousResult.queuedSessions.nodes.filter(s => s.id !== session.id)
            }
          }
        }
      }
    })
    this.emitQueueUpdate()
  }

  render() {
    const { currentTutor, loading } = this.props.data
    const { currentSessions, queuedSessions, priorSessions } = this.props.data
    const mySession = ({ tutorId }) => currentTutor.id === tutorId
    const myCurrentSessions = !loading ? currentSessions.nodes.filter(mySession) : []
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
          <CardSegment disabled={myCurrentSessions.length === 0}>
            <Label size="big">
              {myCurrentSessions.length > 0 ? 'Current Session' : 'No Current Session'}
            </Label>
            <CardContainer>
              {myCurrentSessions.map((session, i) => (
                <CurrentSessionCard
                  handleRequeueSession={this.handleRequeueSession(session)}
                  handleEndSession={this.handleEndSessionClick(session)}
                  key={session.nodeId}
                  session={session}
                  raised={i === 0}
                />
              ))}
            </CardContainer>
          </CardSegment>
        )}
        {/* </Card.Group> */}

        {/* QUEUED SESSIONS */}
        {!loading && (
          <CardSegment disabled={queuedSessions.nodes.length === 0}>
            <Label size="big">
              {queuedSessions.nodes.length > 0 ? 'Queue' : 'Queue Empty'}
              <Label.Detail>{queuedSessions.nodes.length}</Label.Detail>
            </Label>
            <CardContainer>
              {queuedSessions.nodes.map((session, i) => (
                <QueueCard
                  handleDeleteClick={this.handleDeleteSession(session)}
                  handleClaimClick={this.handleClaimSession(session)}
                  key={session.nodeId}
                  session={session}
                  raised={i === 0}
                />
              ))}
            </CardContainer>
          </CardSegment>
        )}
        {/* PRIOR SESSIONS */}
        {!loading && (
          <Header as="h3" disabled={priorSessions.nodes.length === 0} textAlign="left">
            {priorSessions.nodes.length > 0 ? 'Prior Sessions' : 'No Prior Sessions'}
          </Header>
        )}
        {!loading &&
          priorSessions.nodes.length > 0 && (
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
                {priorSessions.nodes.map(session => (
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
  graphql(Sessions, {
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
