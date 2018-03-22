import React from 'react';
import { Switch, Route } from 'react-router-dom';

import Farm from './Farm';
import Analytics from './Analytics';
import Blacklist from './Blacklist';
import About from './About';

const Main = () => (
  <div>
    <Switch>
      <Route exact path='/' component={Farm} />
      <Route exact path='/analytics' component={Analytics} />
      <Route exact path='/blacklist' component={Blacklist} />
      <Route exact path='/about' component={About} />
      <Route path='*' component={Farm} />
    </Switch>
  </div>
)

export default Main;