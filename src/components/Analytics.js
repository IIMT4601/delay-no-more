/* global chrome */
import React, { Component } from 'react';

class Analytics extends Component {
  constructor() {
    super();
    this.state = {}
  }

  componentDidMount() {}

  componentWillUnmount() {}

  render() {
    console.log("analyticsData:", chrome.extension.getBackgroundPage().analyticsData);    
    console.log("todayData:", chrome.extension.getBackgroundPage().todayData);

    return (
      <div>
        <h1>My Browsing Analytics:</h1>
      </div>
    );
  }
}

export default Analytics;