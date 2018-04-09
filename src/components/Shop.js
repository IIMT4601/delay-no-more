import React, { Component } from 'react';

import firebase from '../firebase';
const auth = firebase.auth();
const db = firebase.database();

class Shop extends Component {
  constructor() {
    super();
    this.state = {}
  }

  componentDidMount() {}

  componentWillUnmount() {}

  render() {
    return (
      <div>
        <h1>Shop</h1>
      </div>
    );
  }
}

export default Shop;