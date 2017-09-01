import React from 'react'
// import { IndexRoute, Route, Router, browserHistory } from 'react-router';
import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom'

import App from './containers/App'
import StudentCheckIn from './containers/StudentCheckIn'
import Queue from './containers/Queue'
import Home from './containers/Home'

const Routes = () => {
  return (
    <App>
      <BrowserRouter>
        <Switch>
          <Route exact path="/" component={Home} />
          <Route path="/checkin/:token?" component={StudentCheckIn} />
          <Route path="/queue" component={Queue} />
        </Switch>
      </BrowserRouter>
    </App>
  )
}

export default Routes
