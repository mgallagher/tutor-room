import React, { Component, PropTypes } from 'react';
import logo from './logo.svg';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import {Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn} from 'material-ui/Table';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';

import './App.css';

const myQuery = gql`query {
  allStudents {
    nodes {
      __id
      aNumber
      firstName
      lastName
      visitsByStudentId {
        totalCount
			}
    }
  }
}`;

function buttonList(data) {
  const students = data.allStudents.nodes
  const allButtons = students.map((student) =>
    <TableRow key={student.__id}>
      <TableRowColumn>{student.aNumber}</TableRowColumn>
      <TableRowColumn>{student.firstName}</TableRowColumn>
      <TableRowColumn>{student.lastName}</TableRowColumn>
      <TableRowColumn>{student.visitsByStudentId.totalCount}</TableRowColumn>
    </TableRow>
   )
  return (
    allButtons
  )
}

class App extends Component {

  render() {
    if (!this.props.data.loading) {
      return (
        <MuiThemeProvider>
        <div>
          <TextField
            hintText="Hint Text"
            floatingLabelText="Floating Label Text"
          />
          <Table>
            <TableHeader>
              <TableRow>
                <TableHeaderColumn>A Number</TableHeaderColumn>
                <TableHeaderColumn>First Name</TableHeaderColumn>
                <TableHeaderColumn>Last Name</TableHeaderColumn>
                <TableHeaderColumn>Visits</TableHeaderColumn>
              </TableRow>
            </TableHeader>
            <TableBody>
            {buttonList(this.props.data)}
            </TableBody>
          </Table>
          </div>
        </MuiThemeProvider>
      );
    } else {
      return (
        <p>loading the stuff...</p>
      )
    }
}

}

App.propTypes = {
  data: PropTypes.shape({
  }).isRequired
};

const MyComponentWithData = graphql(myQuery)(App);

const styles = {
  textField: {
    marginTop: '20px'
  }
};

export default MyComponentWithData;
