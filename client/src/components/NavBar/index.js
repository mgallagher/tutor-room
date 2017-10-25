import React from 'react'
import { Dropdown, Icon } from 'semantic-ui-react'
import { graphql } from 'react-apollo'
import styled from 'styled-components'

import config from '../../config'
import { LogOut } from '../../routes'
import AggieIcon from './AggieIcon'
import { CurrentUser } from '../../graphql/queries'

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

const currentUserName = ({ currentTutor, currentStudent }) => {
  if (currentTutor) {
    return currentTutor.preferredName
  } else if (currentStudent) {
    return currentStudent.preferredName
  } else {
    return null
  }
}

const DropdownItems = ({ currentTutor, currentStudent }) => {
  const userName = currentUserName({ currentTutor, currentStudent })
  if (userName) {
    return [
      <Dropdown.Item key={1} text={userName}/>,
      <Dropdown.Item key={2} icon="log out" text="Log out" onClick={LogOut} />
    ]
  }
  else {
    return [
      <Dropdown.Item key={1} href={config.casLoginURL} icon="external" text="Log in"/>
    ]
  }
}

const NavBar = ({ data }) => {
  return (
    <Wrapper>
      <AggieIcon />
      <div>
        <Title>USU CS Tutor Lab</Title>
        <SubTitle>(Beta)</SubTitle>
      </div>
      <Dropdown pointing="top right" icon={<Icon name="user" size="big" />}>
        <Dropdown.Menu>
          {!data.loading && DropdownItems(data)}
        </Dropdown.Menu>
      </Dropdown>
    </Wrapper>
  )
}

export default graphql(CurrentUser)(NavBar)
