import React, { Component } from 'react';

import { getParentARefs } from '../firebase/refs';

class DemoA extends Component {
  constructor() {
    super();
    this.state = {
      parentA: {
        childA: 10
      }
    }
  }

  componentDidMount() {
    const parentARefs = getParentARefs();

    parentARefs.childARef.on('value', snap => {
      this.setState({
        parentA: {
          childA: snap.val()
        }
      })
    })
  }

  componentWillUnmount() {}

  render() {
    return (
      <div>
        <h1>parentA.childA: {this.state.parentA.childA}</h1>
      </div>
    );
  }
}

export default DemoA;