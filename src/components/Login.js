import React, { Component } from 'react';
import '../styles/Login.css';

import RaisedButton from 'material-ui/RaisedButton';
import Card from 'material-ui/Card';
import SocialPerson from 'material-ui/svg-icons/social/person';
import {fullWhite} from 'material-ui/styles/colors';

import firebase from '../firebase';

const styles = {
  button: {
    backgroundColor: 'rgb(180, 180, 180)'
  }
}

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
      <div className="login">
        <Card className="login__panel">
          <div className="login-panel__header">
            <img className="login-panel-header__logo" src="/DLNM.png" alt=""/>
            <h1 style={{color:"white"}} >Delay No More</h1>
          </div>
          <div>
            <RaisedButton 
              label="Sign in with Google"
              onClick={this.handleGoogleSignIn}
              icon={<SocialPerson color={fullWhite}/>}
              buttonStyle={styles.button}
              labelColor="white"
            />
          </div>
        </Card>
      </div>
    );
  }
}

export default Login;