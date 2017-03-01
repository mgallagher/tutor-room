import React from 'react';
import { addDecorator, storiesOf, action, linkTo } from '@kadira/storybook';
import Button from 'react-toolbox/lib/button/Button';
import { ThemeProvider as AppTheme } from 'styled-components';
import ThemeProvider from 'react-toolbox/lib/ThemeProvider';
import Input from 'react-toolbox/lib/input/Input';

import '../assets/react-toolbox/theme.css';
import theme from '../assets/react-toolbox/theme.js';
import usuTheme from '../styles';
import Welcome from './Welcome';
import Loading from '../components/Loading'
import NavBar from '../components/NavBar'
import DataCard from '../components/DataCard'

const withStyles = (story) => (
  <AppTheme theme={usuTheme}>
    <ThemeProvider theme={theme}>
        {story()}
    </ThemeProvider>
  </AppTheme>
);

addDecorator(withStyles);

storiesOf('Welcome', module)
  .add('to Storybook', () => (
    <Welcome showApp={linkTo('Button')}/>
  ));

storiesOf('Button', module)
  .add('Primary', () => (
    <Button raised primary onClick={action('clicked')}>SUBMIT</Button>
  ));

storiesOf('Loading Indicator', module)
  .add('Currently Loading', () => (
    <Loading />
  ));

storiesOf('Input', module)
  .add('With hint', () => (
    <Input
      type='text'
      label='A Number'
      name='aNumber'
    />
  ));

storiesOf('Navigation Bar', module)
  .add('Logged out', () => (
    <NavBar />
  ));

storiesOf('DataCard', module)
  .add('Number', () =>(
    <DataCard
      number={3}
      label="students waiting"
    />
  ));
