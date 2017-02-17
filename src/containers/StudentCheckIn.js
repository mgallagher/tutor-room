import { browserHistory } from 'react-router'
import React, { Component } from 'react'
import styled from 'styled-components'
import Button from 'react-toolbox/lib/button/Button';
import Card from 'react-toolbox/lib/card/Card';
import Input from 'react-toolbox/lib/input/Input';

const FormWrapper = styled.form`
  width: 400px;
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

const InputWrapper = styled.div`
  // position: relative;
  // top: 50%;
  // transform: translateY(-60%);
`;

class StudentCheckIn extends Component {
  constructor() {
    super()

    this.state = {
      aNumber: ''
    }
  }

  handleChange(value) {
    if (value === '') {
      value = 'A'
    }
    this.setState({
      ...this.state,
      aNumber: value
    })
  }

  handleSubmit(event) {
    browserHistory.push(`get-help/${this.state.aNumber}`)
  }

  render() {
    return (
      <FormWrapper onSubmit={this.handleSubmit.bind(this)}>
        <StyledCard>
        <InputWrapper>
          <StyledInput
            type='text'
            onChange={this.handleChange.bind(this)}
            value={this.state.aNumber}
            label='A Number'
            name='aNumber'
            required
          />
          <StyledButton onClick={this.handleSubmit.bind(this)} label='Submit' raised primary />
        </InputWrapper>
        </StyledCard>
      </FormWrapper>
    )
  }
}

export default StudentCheckIn
