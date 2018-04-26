import React from 'react';
import { Switch, Route } from 'react-router-dom';

import Farm from './Farm';
import Shop from './Shop';
import Analytics from './Analytics';
import Blacklist from './Blacklist';
import Setup from './Setup';
import Settings from './Settings';
import About from './About';

const Main = () => (
  <div>
    <Switch>
      <Route exact path='/' component={Farm} />
      <Route exact path='/shop' component={Shop} />
      <Route exact path='/analytics' component={Analytics} />
      <Route exact path='/blacklist' component={Blacklist} />
      <Route exact path='/stepper' component={Setup} />
      <Route exact path='/about' component={About} />
      <Route exact path='/settings' component={Settings} />
      <Route path='*' component={Farm} />
    </Switch>
  </div>
)

export default Main;