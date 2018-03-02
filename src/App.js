import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

import firebase from './firebase';

import DemoA from './components/DemoA';
import Login from './components/Login';
import Logout from './components/Logout';

const initialState = {
  user: null
}

class App extends Component {
  constructor() {
    super();
    this.state = initialState;
  }

  componentDidMount() {
    const auth = firebase.auth();
    auth.onAuthStateChanged(user => {
      if (user) {
        console.log("Firebase User:", user);
        this.setState({
          user: {
            providerData: user.providerData[0]
          } 
        })
      }
      else {
        this.setState(initialState);
      }
    })
  }

  componentWillUnmount() {}

  render() {
    console.log("this.state:", this.state);

    if (!this.state.user) {
      return (
        <Login />
      );
    }
    else {
      return (
        <div className="App">
          <header className="App-header">
            <img src={logo} className="App-logo" alt="logo" />
            <h1 className="App-title">Welcome to React</h1>
          </header>
          <p className="App-intro">
            To get started, edit <code>src/App.js</code> and save to reload.
          </p>

          <DemoA className="demo" />
          <h1>Hi {this.state.user.providerData.displayName}</h1>
          <Logout />
        </div>
      );
    }
  }
}

export default App;
