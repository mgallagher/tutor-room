import React from 'react';
import styled from 'styled-components';
import { graphql } from 'react-apollo';
import { compose } from 'recompose';
import { Grid, Header, Label, Icon } from 'semantic-ui-react';

import EnterAggieNumber from './EnterAggieNumber';
import SelectClass from './SelectClass';
import EnterDescription from './EnterDescription';
import { CreateSession } from '../../graphql/mutations';
import { AverageWait } from '../../graphql/queries';

const SqueezedColumn = styled(Grid.Column)`
  max-width: 450px;
`;

const FlexCenter = styled.div`
  display: flex;
  justify-content: center;
`;

const enhance = compose(graphql(CreateSession));

const AverageWaitLabel = ({ data }) => {
  const { latestAverageWait, loading } = data;
  return (
    <Label size="big">
      <Icon name="wait" />
      Average wait:
      <Label.Detail>
        {loading ? '...' : `${latestAverageWait.minutes} minutes`}
      </Label.Detail>
    </Label>
  );
};

export const AverageWaitWithData = graphql(AverageWait, { options: { pollInterval: 5000 } })(
  AverageWaitLabel
);

class StudentCheckIn extends React.Component {
  initialState = {
    aNumber: '',
    crn: 0,
    description: '',
    reason: '',
    submitted: false,
  };
  state = this.initialState;

  handleChange = (e, { name, value }) => this.setState({ [name]: value });
  handleClassSelect = crn => event => this.setState({ crn: crn });
  handleSubmit = async event => {
    event.preventDefault();
    const { aNumber, crn, description, reason } = this.state;
    await this.props.mutate({
      variables: { aNumber, crn, description, reason },
    });
    this.setState({ submitted: true });
    setTimeout(() => this.setState(this.initialState), 3000);
  };

  render() {
    return (
      <Grid centered columns={1} textAlign="left">
        {!this.state.submitted &&
          <SqueezedColumn>
          <FlexCenter>
            <AverageWaitWithData />
          </FlexCenter>
            <EnterAggieNumber value={this.state.aNumber} onChange={this.handleChange} />
            {this.state.aNumber.length === 9 &&
              <SelectClass
                aNumber={this.state.aNumber}
                handleClassClick={this.handleClassSelect}
                selectedClass={this.state.crn}
              />}
            <EnterDescription
              onChange={this.handleChange}
              onSubmit={this.handleSubmit}
              checked={this.state.reason}
            />
          </SqueezedColumn>}
        {this.state.submitted && <Header as="h2">Thank you!</Header>}
      </Grid>
    );
  }
}

// export default enhance(StudentCheckIn);
export default enhance(StudentCheckIn);
