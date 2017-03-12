import React from 'react';
import { Route, Router, browserHistory } from 'react-router';

import App from './containers/App';
import StudentCheckIn from './containers/StudentCheckIn/index';

function Routes() {
  return (
    <Router history={browserHistory}>
      <Route path="/" component={App}>
        <Route path="checkin" component={StudentCheckIn} />
      </Route>
    </Router>
  );
}

export default Routes;
