import React from 'react';
import styled from 'styled-components';
import gql from 'graphql-tag';
import { graphql } from 'react-apollo';
import { compose } from 'recompose';
import { Grid, Header } from 'semantic-ui-react';

import EnterAggieNumber from './EnterAggieNumber';
import SelectClass from './SelectClass';
import EnterDescription from './EnterDescription';

const SqueezedColumn = styled(Grid.Column)`
  max-width: 450px;
`;

const CREATE_VISIT_MUTATION = gql`
  mutation startVisit($aNumber: String!, $crn:Int!, $reason: TutoringReason, $description:String) {
    startVisit(input: {aNumber: $aNumber, crn: $crn, reason: $reason, description:$description}) {
      visit {
        nodeId
        id
        description
      }
    }
  }
`;

const enhance = compose(graphql(CREATE_VISIT_MUTATION));

class StudentCheckIn extends React.Component {
  initialState = {
    aNumber: '',
    crn: 0,
    description: '',
    reason: '',
    submitted: false
  };
  state = this.initialState;

  handleChange = (e, { name, value }) => this.setState({ [name]: value });
  handleClassSelect = crn => event => this.setState({ crn: crn });
  handleSubmit = async event => {
    event.preventDefault();
    const { aNumber, crn, description, reason } = this.state;
    await this.props.mutate({
      variables: { aNumber, crn, description, reason }
    });
    this.setState({ submitted: true });
    setTimeout(() => this.setState(this.initialState), 3000);
  };

  render() {
    return (
      <Grid centered columns={1} textAlign="left">
        {!this.state.submitted &&
          <SqueezedColumn>
            <EnterAggieNumber
              value={this.state.aNumber}
              onChange={this.handleChange}
            />
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
