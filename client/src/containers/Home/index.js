import React from 'react';
import { Grid } from 'semantic-ui-react';

import { AverageWaitWithData } from '../StudentCheckIn';

const Home = () => {
  return (
    <Grid centered columns={1}>
      <AverageWaitWithData />
    </Grid>
  );
};

export default Home;
