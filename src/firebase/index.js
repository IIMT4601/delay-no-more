const firebase = require("firebase");

// Initialize Firebase
var config = {
    apiKey: "AIzaSyBqzEfNxqvZsZNfGxSzENLy-BPd-VTzFf4",
    authDomain: "delay-no-more-3a8e7.firebaseapp.com",
    databaseURL: "https://delay-no-more-3a8e7.firebaseio.com",
    projectId: "delay-no-more-3a8e7",
    storageBucket: "delay-no-more-3a8e7.appspot.com",
    messagingSenderId: "498467824799"
  };

firebase.initializeApp(config);

export default firebase;