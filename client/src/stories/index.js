import React from 'react';
import { addDecorator, storiesOf, action, linkTo } from '@kadira/storybook';
import styled from 'styled-components';

import Welcome from './Welcome';
import NavBar from '../components/NavBar';
import FinishSessionForm from '../containers/Queue/FinishSession';

const StoryWrapper = styled.div`
  padding: 10px;
`;

const withStyles = (story) => (
  <StoryWrapper>
    <link rel="stylesheet" href="//cdnjs.cloudflare.com/ajax/libs/semantic-ui/2.2.2/semantic.min.css"></link>
    {story()}
  </StoryWrapper>
);

addDecorator(withStyles);

storiesOf('Welcome', module)
  .add('to Storybook', () => (
    <Welcome showApp={linkTo('Button')}/>
  ));

storiesOf('Navigation Bar', module)
  .add('Logged out', () => (
    <p>Hello!</p>
  ));

storiesOf('Sessions', module)
  .add('Finish Session Form', () => (
    <FinishSessionForm checked="debugging" />
  ));
