import React from 'react'
import styled from 'styled-components'
import { Segment, Form, Header } from 'semantic-ui-react'

import { sessionReasons } from '../../constants'

const CenteredButton = styled(Form.Button)`
  display: flex;
  justify-content: center;
`

const EnterDescription = ({ checked, onChange, onSubmit }) => {
  return (
    <Segment>
      <Header as="h3" textAlign="center">
        Tell us how we can help
      </Header>
      <Form onSubmit={onSubmit}>
        <Form.Group widths="equal">
          {[...sessionReasons].map(([reason, label]) => (
            <Form.Radio
              key={reason}
              label={label}
              checked={checked === reason}
              onChange={onChange}
              name="reason"
              value={reason}
            />
          ))}
        </Form.Group>
        <Form.TextArea autoHeight label="Description" name="description" onChange={onChange} spellcheck="false"/>
        <CenteredButton>Submit</CenteredButton>
      </Form>
    </Segment>
  )
}

export default EnterDescription
