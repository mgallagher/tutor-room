import React from 'react';
import styled from 'styled-components'

const Wrapper = styled.div`
  font-size: 20pt;
  font-weight: lighter;
  color: ${props => props.theme.textSecondary};
`;

const Loading = () => (
  <Wrapper>loading...</Wrapper>
);

export default Loading;
