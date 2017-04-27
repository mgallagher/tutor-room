import React from 'react';
import PropTypes from 'prop-types';
import { Form, Segment } from 'semantic-ui-react';

const EnterAggieNumber = ({ value, onChange }) => (
  <Segment>
    <h3>Enter Your A-Number</h3>
    <Form size="large">
      <Form.Input name="aNumber" onChange={onChange} placeholder="A-Number" />
    </Form>
  </Segment>
);

EnterAggieNumber.propTypes = {
  value: PropTypes.string,
  onChange: PropTypes.func.isRequired,
};

export default EnterAggieNumber;
