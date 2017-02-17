import React, { Component, PropTypes } from 'react';
import logo from './logo.svg';
import {Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn} from 'material-ui/Table';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';

// import './App.css';
import Button from 'react-toolbox/lib/button/Button';
import StudentQueueContainer from './containers/StudentQueueContainer'

class App extends Component {

  render() {
    return (
      <div>
        <StudentQueueContainer />
      </div>
    )
  }
}

export default App;
