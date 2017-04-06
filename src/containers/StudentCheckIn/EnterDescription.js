import React from 'react';
import { Segment, Form } from 'semantic-ui-react';

import { visitReasons } from '../../constants';

const EnterDescription = ({ checked, onChange, onSubmit }) => {
  return (
    <Segment>
      <h3>Tell us how we can help</h3>
      <Form onSubmit={onSubmit}>
        <Form.Group widths="equal">
          {[...visitReasons].map(([reason, label]) => (
            <Form.Radio
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
