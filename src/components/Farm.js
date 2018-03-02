import React, { Component } from 'react';

import DemoA from './DemoA';

class Farm extends Component {
  constructor() {
    super();
    this.state = {}
  }

  componentDidMount() {}

  componentWillUnmount() {}

  render() {
    return (
      <div>
        <h1>My Farm:</h1>
        <DemoA />
      </div>
    );
  }
}

export default Farm;