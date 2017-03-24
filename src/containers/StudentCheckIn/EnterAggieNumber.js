import React from 'react';
import { compose, withState, withHandlers } from 'recompose';
import { Form, Segment } from 'semantic-ui-react';


const EnterAggieNumber = ({ value, onChange, onSubmit }) => (
  <Segment>
    <h2>Enter Your A-Number</h2>
    <Form onSubmit={onSubmit} size="large">
      <Form.Input name="aNumber" onChange={onChange} placeholder="A-Number" />
      <Form.Button primary>Submit</Form.Button>
    </Form>
  </Segment>
);

export default EnterAggieNumber;
