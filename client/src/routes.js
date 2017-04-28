import React from 'react';
import { IndexRoute, Route, Router, browserHistory } from 'react-router';

import App from './containers/App';
import StudentCheckIn from './containers/StudentCheckIn';
import Queue from './containers/Queue';
import Home from './containers/Home'

const Routes = () => {
  return (
    <Router history={browserHistory}>
      <Route path="/" component={App}>
        <IndexRoute component={Home} />
        <Route path="checkin" component={StudentCheckIn} />
        <Route path="queue" component={Queue} />
      </Route>
    </Router>
  );
};

export default Routes;
