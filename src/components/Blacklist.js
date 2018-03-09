import React, { Component } from 'react';

class Blacklist extends Component {
  constructor() {
    super();
    this.state = {
      blacklist: [
        "www.google.com",
        "www.gmail.com"
      ]
    }
  }

  componentDidMount() {


  }

  componentWillUnmount() {}


  render() {
    return (
      <div>
        <h1>My Blacklist:</h1>
        <input ref="myInput" type="text"/>
        <ul>
          {this.state.blacklist.map(site => (
            <li>{site}</li>
          ))}
        </ul>
      </div>
    );
  }
}

export default Blacklist;