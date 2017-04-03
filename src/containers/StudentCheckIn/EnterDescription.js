import React from 'react';
import { Segment, Form } from 'semantic-ui-react';

const reasons = {
  debugging: 'DEBUGGING',
  syntax: 'SYNTAX',
  concept: 'CONCEPT',
  program_design: 'PROGRAM_DESIGN'
};

const EnterDescription = ({ checked, onChange, onSubmit }) => {
  return (
    <Segment>
      <h3>Tell us how we can help</h3>
      <Form onSubmit={onSubmit}>
        <Form.Group widths="equal">
          <Form.Radio
            label="Debugging"
            checked={checked === reasons.debugging}
            onChange={onChange}
            name="reason"
            value={reasons.debugging}
          />
          <Form.Radio
            label="Syntax"
            checked={checked === reasons.syntax}
            onChange={onChange}
            name="reason"
            value={reasons.syntax}
          />
          <Form.Radio
            label="Concept"
            checked={checked === reasons.concept}
            onChange={onChange}
            name="reason"
            value={reasons.concept}
          />
          <Form.Radio
            label="Program Design"
            checked={checked === reasons.program_design}
            onChange={onChange}
            name="reason"
            value={reasons.program_design}
          />
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
