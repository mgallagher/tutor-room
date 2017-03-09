import { browserHistory } from 'react-router'
import React, { Component } from 'react'
import styled from 'styled-components'
import Button from 'react-toolbox/lib/button/Button';
import Card from 'react-toolbox/lib/card/Card';
import Input from 'react-toolbox/lib/input/Input';

const FormWrapper = styled.form`
  max-width: 500px;
  margin: 0 auto;
`;

const StyledCard = styled(Card)`
  height: 250px;
  padding: 15px;
`;

const StyledButton = styled(Button)`
  margin: 0 auto;
`;

const StyledInput = styled(Input)`
  font-size: 25px;
`;

class StudentCheckIn extends Component {
  state = { aNumber: '' };
  handleChange = value => this.setState({aNumber: value});

  handleSubmit(event) {
    browserHistory.push(`get-help/${this.state.aNumber}`)
  }

  render() {
    return (
      <FormWrapper onSubmit={this.handleSubmit.bind(this)}>
        <StyledCard>
          <StyledInput
            type='text'
            onChange={this.handleChange.bind(this)}
            value={this.state.aNumber}
            label='A Number'
            name='aNumber'
          />
          <StyledButton onClick={this.handleSubmit.bind(this)} label='Submit' raised primary />
        </StyledCard>
      </FormWrapper>
    )
  }
};

export default StudentCheckIn;
