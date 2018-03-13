/* global chrome */
import React, { Component } from 'react';

class Analytics extends Component {
  constructor() {
    super();
    this.state = {}
  }

  componentDidMount() {
    console.log("Chrome:", chrome.extension.getBackgroundPage().blacklist);
  }

  componentWillUnmount() {}

  render() {
    return (
      <div>
        <h1>My Browsing Analytics:</h1>
      </div>
    );
  }
}

export default Analytics;