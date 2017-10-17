import React from 'react'
import { BrowserRouter, Route, Switch } from 'react-router-dom'

import config from './config'
import App from './containers/App'
import StudentCheckIn from './containers/StudentCheckIn'
import Queue from './containers/Queue'
import Home from './containers/Home'

export const LogOut = () => {
  localStorage.removeItem('token')
  window.location.assign(config.casLoginURL)
}

const Routes = () => {
  return (
    <App>
      <BrowserRouter>
        <Switch>
          <Route exact path="/" component={Home} />
          <Route path="/checkin/:token?" component={StudentCheckIn} />
          <Route path="/queue/:token?" component={Queue} />
          <Route path="/logout" component={LogOut} />
        </Switch>
      </BrowserRouter>
    </App>
  )
}

export default Routes
