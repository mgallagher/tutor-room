import React from 'react'
import styled from 'styled-components'
import { Dropdown, Icon } from 'semantic-ui-react'

import { LogOut } from '../../routes'
import AggieIcon from './AggieIcon'

const Wrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: ${props => props.theme.primary};
  color: white;
  padding: 5px 15px;
  min-height: 45px;
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

const NavBar = () => (
  <Wrapper>
    <AggieIcon />
    <div>
      <Title>USU CS Tutor Lab</Title>
      <SubTitle>(Beta)</SubTitle>
    </div>
    <Dropdown pointing="top right" icon={<Icon name="user" size="big" />}>
      <Dropdown.Menu>
        <Dropdown.Item icon="log out" text="Log out" onClick={LogOut} />
      </Dropdown.Menu>
    </Dropdown>
  </Wrapper>
)

export default NavBar
