import React, { Component } from 'react';
import './App.css';

import Login from './components/Login';
import Setup from './components/Setup';
import Menu from './components/Menu';
import Main from './components/Main';

import firebase from './firebase';
const auth = firebase.auth();
const db = firebase.database();

const initialState = {
  setupCompleted: true,
  user: null
}

class App extends Component {
  constructor() {
    super();
    this.state = initialState;
  }

  componentDidMount() {
    auth.onAuthStateChanged(user => {
      if (user) {
        db.ref('settings').child(user.uid).child('setupCompleted').on('value', snap => {
          this.setState({
            setupCompleted: snap.val() == null ? false : true
          });
        });

        this.setState({
          user: {
            providerData: user.providerData[0]
          }
        });
      }
      else {
        this.setState(initialState);
      }
    })
  }

  componentWillUnmount() {}

  render() {
    // console.log("this.state:", this.state);

    if (!this.state.user) {
      return (
        <div className="App">
          <Login />
        </div>
      );
    }
    else {
      if (!this.state.setupCompleted) {
        return (
          <div className="App">
            <Setup />
          </div>
        );
      }
      else {
        return (
          <div className="App">
            <Menu {...this.state} />
            <Main {...this.state} />
          </div>
        );
      }
    }
  }
}

export default App;