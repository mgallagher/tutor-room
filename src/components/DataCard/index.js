import React, { PropTypes } from 'react';
import styled from 'styled-components';

import Card from 'react-toolbox/lib/card/Card';

const WrapperCard = styled(Card)`
  height: 200px;
  width: 350px;
  padding: 10px;
  text-align: center;
  display: flex;
  justify-content: center;
`;

const LargeNumber = styled.label`
  font-size: 110pt;
  font-weight: lighter;
  line-height: 0.9;
  color: ${props => props.theme.black};
`;

const Label = styled.label`
  font-size: 20pt;
  font-weight: lighter;
  color: ${props => props.theme.grey};
`;

function DataCard(props) {
  return(
    <WrapperCard>
      <LargeNumber>{props.number}</LargeNumber>
      <Label>{props.label}</Label>
    </WrapperCard>
  )
}

DataCard.propTypes = {
  label: PropTypes.string.isRequired,
  number: PropTypes.string.isRequired
};

export default DataCard
