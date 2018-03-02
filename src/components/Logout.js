import React, { Component } from 'react';

import MenuItem from 'material-ui/MenuItem';

import firebase from '../firebase';

class Logout extends Component {
  constructor() {
    super();
    this.state = {}
  }

  componentDidMount() {}

  componentWillUnmount() {}

  handleLogOut = () => {
    firebase.auth().signOut();
  }

  render() {
    return (
      <div>
        <MenuItem primaryText="Log Out" onClick={this.handleLogOut} />
      </div>
    );
  }
}

export default Logout;