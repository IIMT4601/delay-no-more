import React, { Component } from 'react';

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
        <button onClick={this.handleLogOut}>LOG OUT</button>
      </div>
    );
  }
}

export default Logout;