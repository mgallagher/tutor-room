import React, { Component } from 'react';
// import { browserHistory } from 'react-router';
import { compose, withState, withHandlers } from 'recompose';
import styled from 'styled-components';
import Button from 'react-toolbox/lib/button/Button';
import Card from 'react-toolbox/lib/card/Card';
import Input from 'react-toolbox/lib/input/Input';


const enhance = compose(
  withState('count', 'updateCount', 0),
  withHandlers({
    increment: props => () => props.updateCount(n => n + 1),
    decrement: props => () => props.updateCount(n => n - 1)
  })
)

const Counter = enhance(({ count, increment, decrement }) =>
	<div>
    Count: {count}
    <div>
      <button onClick={increment}>+</button>
      <button onClick={decrement}>-</button>
    </div>
  </div>
)

export default Counter
