import React from 'react';
import { Segment, Form } from 'semantic-ui-react';

import { sessionTags } from '../../constants';

const FinishSessionForm = ({ checked, onChange, onSubmit }) => {
  return (
    <Segment padded>
      <h3>Finish Session</h3>
      <Form onSubmit={onSubmit}>
        <Form.Group inline widths="equal">
          {[...sessionTags].map(([tag, description]) => (
            <Form.Radio
              key={tag}
              label={description}
              checked={checked === tag}
              onChange={onChange}
              name="sessionTag"
              value={tag}
            />
          ))}
        </Form.Group>
        <Form.Input label="Notes" name="sessionNotes" placeholder="Optional" onChange={onChange} />
        <Form.Button disabled={checked ? false : true}>Submit</Form.Button>
      </Form>
    </Segment>
  );
};

export default FinishSessionForm;
