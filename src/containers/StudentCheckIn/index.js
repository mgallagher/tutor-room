import React from 'react';
import styled from 'styled-components';
import { compose, withState, withHandlers } from 'recompose';
import { Grid } from 'semantic-ui-react';

import EnterAggieNumber from './EnterAggieNumber';

const SqueezedColumn = styled(Grid.Column)`
  max-width: 450px
`;

const enhance = compose(
  withState('aNumber', 'setData', ''),
  withState('step', 'incrementStep', 1),
  withHandlers({
    // handleANumberChange: props =>
    //   aNumber => {
    //     props.setANumber(aNumber);
    //   },
    handleChange: props => event => props.setData(event.target.value),
    handleNextStep: props =>
      event => {
        event.preventDefault();
        props.incrementStep(step => step + 1);
      }
  })
);

const StudentCheckIn = ({ aNumber, step, handleChange, handleNextStep }) => {
  console.log(aNumber)
  return (
    <Grid centered columns={1}>
      <SqueezedColumn>
        {step === 1 &&
          <EnterAggieNumber
            value={aNumber}
            onSubmit={handleNextStep}
            onChange={handleChange}
          />}
        {step === 2 && <div>LOL</div>}
      </SqueezedColumn>
    </Grid>
  );
};

export default enhance(StudentCheckIn);
