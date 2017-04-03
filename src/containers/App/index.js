import React, { Component } from 'react';
import styled from 'styled-components';

import NavBar from '../../components/NavBar';

const ContentWrapper = styled.div`
  margin-top: 30px;
`;

class App extends Component {
  render() {
    return (
      <div>
        <NavBar />
        <ContentWrapper>
          {this.props.children}
        </ContentWrapper>
      </div>
    );
  }
}

export default App;
