import React, { Component } from 'react';
import './App.css';

import firebase from './firebase';

import Load from './components/Load';
import Login from './components/Login';
import Menu from './components/Menu';
import Main from './components/Main';

class App extends Component {
  constructor() {
    super();
    this.state = {
      loading: true,
      user: null
    }
  }

  componentDidMount() {
    const auth = firebase.auth();
    auth.onAuthStateChanged(user => {
      if (user) {
        // console.log("Firebase User:", user);
        this.setState({
          user: {
            providerData: user.providerData[0]
          }
        })
      }
      else {
        this.setState({user: null})
      }
      this.setState({loading: false});
    })
  }

  componentWillUnmount() {}

  render() {
    // console.log("this.state:", this.state);
    if (this.state.loading) {
      return (
        <div class="appLoad"> 
          <Load/>
        </div>
      );
    }
    else {
      if (!this.state.user) {
        return (
          <div className="App">
            <Login />
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
