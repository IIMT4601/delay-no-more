import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import Logout from './Logout';

class Menu extends Component {
  constructor(props) {
    super(props);
    this.state = {}
  }

  componentDidMount() {}

  componentWillUnmount() {}

  render() {
    return (
      <div>
        <h1>Menu:</h1>
        <ul>
          <li>Hi {this.props.user.providerData.displayName}</li>
          <li><Link to={'/'}>Farm</Link></li>
          <li><Link to={'/about'}>About</Link></li>
          <li><Logout /></li>
        </ul>
      </div>
    );
  }
}

export default Menu;