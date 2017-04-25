import React from 'react';
import { Segment, Form } from 'semantic-ui-react';

import { sessionReasons } from '../../constants';

const EnterDescription = ({ checked, onChange, onSubmit }) => {
  return (
    <Segment>
      <h3>Tell us how we can help</h3>
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
        <Form.TextArea
          autoHeight
          label="Description"
          name="description"
          onChange={onChange}
        />
        <Form.Button>Submit</Form.Button>
      </Form>
    </Segment>
  );
};

export default EnterDescription;
