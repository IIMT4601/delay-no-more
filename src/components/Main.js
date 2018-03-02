import React from 'react';
import { Switch, Route } from 'react-router-dom';

import Farm from './Farm';
import About from './About';

const Main = () => (
  <div>
    <Switch>
      <Route exact path='/' component={Farm} />
      <Route exact path='/about' component={About} />
    </Switch>
  </div>
)

export default Main;