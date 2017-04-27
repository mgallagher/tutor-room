import React from 'react';
import { Route, Router, browserHistory } from 'react-router';

import App from './containers/App';
import StudentCheckIn from './containers/StudentCheckIn';
import Queue from './containers/Queue';

const Routes = () => {
  return (
    <Router history={browserHistory}>
      <Route path="/" component={App}>
        <Route path="checkin" component={StudentCheckIn} />
        <Route path="queue" component={Queue} />
      </Route>
    </Router>
  );
};

export default Routes;
