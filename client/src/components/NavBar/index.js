import React from 'react'
import styled from 'styled-components'

import AccountIcon from './AccountIcon'
import AggieIcon from './AggieIcon'

const Wrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: ${props => props.theme.primary};
  color: white;
  padding: 5px 10px;
`

const Title = styled.span`
  font-weight: lighter;
  font-size: 15pt;
  margin: 5px;
`

const SubTitle = styled.span`
  font-weight: lighter;
  font-size: 9pt;
`

function NavBar() {
  return (
    <Wrapper>
      <AggieIcon />
      <div>
        <Title>USU CS Tutor Lab</Title>
        <SubTitle>(Beta)</SubTitle>
      </div>
      <AccountIcon />
    </Wrapper>
  )
}

export default NavBar
