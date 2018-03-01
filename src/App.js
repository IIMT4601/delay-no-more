import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

import firebase from './firebase';
import { getParentARefs } from './firebase/refs';

class App extends Component {
  constructor() {
    super();
    this.state = {
      childA: 10
    }
  }

  componentDidMount() {
    const parentARefs = getParentARefs();

    const childARef = parentARefs.childARef;
    childARef.on('value', snap => {
      this.setState({
        childA: snap.val()
      })
    })
  }

  componentWillUnmount() {}

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to React</h1>
        </header>
        <p className="App-intro">
          To get started, edit <code>src/App.js</code> and save to reload.
        </p>
        <p className="test">
          <h1>parentA.childA: {this.state.childA}</h1>
        </p>
      </div>
    );
  }
}

export default App;
