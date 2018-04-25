import React, { Component } from 'react';

import RaisedButton from 'material-ui/RaisedButton';
import Card from 'material-ui/Card';
import SocialPerson from 'material-ui/svg-icons/social/person';

import firebase from '../firebase';

class Login extends Component {
  constructor() {
    super();
    this.state = {}
  }

  componentDidMount() {}

  componentWillUnmount() {}

  handleGoogleSignIn = () => {
    var provider = new firebase.auth.GoogleAuthProvider();
    firebase.auth().signInWithPopup(provider).then(function(result) {
      // This gives you a Google Access Token. You can use it to access the Google API.
      var token = result.credential.accessToken;
      // The signed-in user info.
      var user = result.user;
      // ...
    }).catch(function(error) {
      // Handle Errors here.
      var errorCode = error.code;
      var errorMessage = error.message;
      // The email of the user's account used.
      var email = error.email;
      // The firebase.auth.AuthCredential type that was used.
      var credential = error.credential;
      // ...
      console.log(errorMessage);
    });
  }

  render() {
    return (
      <div className="loginContainer">
        <Card className="loginPanel">
          <div className="loginHeader">
            <img id="loginLogo" src="/DLNM.png" alt=""/>
            <h1>Delay No More</h1>
          </div>
          <div className="loginOptions">
            <RaisedButton 
              label="Sign in with Google" 
              primary={true} 
              onClick={this.handleGoogleSignIn}
              icon={<SocialPerson />} 
            />
          </div>
        </Card>
      </div>
    );
  }
}

export default Login;