import React, { Component } from 'react';
import Checkbox from 'material-ui/Checkbox';
import FlatButton from 'material-ui/FlatButton';
import Dialog from 'material-ui/Dialog';
import TimePicker from 'material-ui/TimePicker';
import Snackbar from 'material-ui/Snackbar';
import {amber600, blueGrey900} from 'material-ui/styles/colors';
import ActionSettings from 'material-ui/svg-icons/action/settings';



import firebase from '../firebase';
const auth = firebase.auth();
const db = firebase.database();

class Settings extends Component {
  constructor() {
    super();
    this.state = {
      blacklistActiveDays:{
        "MON": true,
        "TUE": true,
        "WED": true,
        "THUR": true,
        "FRI": true,
        "SAT": true,
        "SUN": true
      },
      timeIntervalCounter: 0,
      maxTimeIntervals: 5,
      dialogOpen: false,
      snackbarOpen: false,
      snackbarMessage: ""
    }
  }

  componentDidMount() {
    auth.onAuthStateChanged(user => {
      if (user) {
        db.ref('settings').child(user.uid).child('blacklistActiveDays').on('value', snap => {
          console.log("snap.val():", snap.val());
          if (snap.val() !== null) {
            this.setState({
              blacklistActiveDays: {
                ...this.state.blacklistActiveDays,
                ...snap.val()
              }
            });            
          }
        });
      }
    });
  }

  componentWillUnmount() {}

  handleCheck = day => {
    auth.onAuthStateChanged(user => {
      if (user) {
        const p = !this.state.blacklistActiveDays[day];
        db.ref('settings').child(user.uid).child('blacklistActiveDays').child(day).set(p, err => {
          if (err) {
            this.setState({
              snackbarOpen: true,
              snackbarMessage: "Unable to save settings. Please try again."
            });            
          }
          else {
            this.setState({
              snackbarOpen: true,
              snackbarMessage: "Your settings have been saved"
            });
          }
        });
      }
    });
  };

  handleAddTimeInterval = () => {
    let numOfTimeIntervals = this.state.timeIntervalCounter;
    let maxNumOfTimeIntervals = this.state.maxTimeIntervals;
    if (numOfTimeIntervals >= maxNumOfTimeIntervals){
      this.handleDialogOpen();
    }else{
      this.setState({
        timeIntervalCounter: this.state.timeIntervalCounter + 1
      });
    }
    console.log("timeIntervalCounter: ", this.state.timeIntervalCounter);
  };

  handleDialogOpen = () => {
    this.setState({dialogOpen: true});
  };

  handleDialogClose = () => {
    this.setState({dialogOpen: false});
  };

  handleSnackbarClose = () => {
    this.setState({
      snackbarOpen: false
    });
  };

  render() {
    console.log("this.state:", this.state);

    const actions = [
      <FlatButton
        label="OK"
        primary={true}
        keyboardFocused={true}
        onClick={this.handleDialogClose}
      />,
    ];

    const checkboxIconStyle = {
      marginRight: '5px',
      fill: amber600
    };

    return (
      <div className="settings-main-div">
        <h1>
          <ActionSettings
            color={blueGrey900}
          /> Settings
        </h1>
        <h2 className="settings-category">Blacklist</h2>
        <h3 className="settings-title">Set active days</h3>
        <p className="settings-description">Select the days in which you want your blacklist to be activated.</p>
        <div className="blacklist-active-days">
          {Object.keys(this.state.blacklistActiveDays).map((day, index) =>
            <Checkbox
              key={index}
              label={day}
              checked={this.state.blacklistActiveDays[day]}
              onCheck={() => this.handleCheck(day)}
              className="blacklist-active-days-checkbox"
              iconStyle={checkboxIconStyle}
            />
          )}
        </div>

        <h3 className="settings-title">Set time intervals</h3>
        <div className="blacklist-time-intervals">
          <FlatButton
            label="+ Add Time Interval"
            onClick={this.handleAddTimeInterval}
            className="time-interval-add-button"
          />
          <Dialog
            title="Max Time Intervals Reached"
            actions={actions}
            modal={false}
            open={this.state.dialogOpen}
            onRequestClose={this.handleDialogClose}
          >
            You cannot add any more time intervals because you have reached the maximum amount.
          </Dialog>
          <div className="time-pickers">
            <h3>From:</h3>
            <TimePicker
              hintText="12-hour format"
            />
            <h3>To:</h3>
            <TimePicker
              hintText="12-hour format"
            />
          </div>
        </div>

        <Snackbar
          open={this.state.snackbarOpen}
          message={this.state.snackbarMessage}
          autoHideDuration={4000}
          onRequestClose={this.handleSnackbarClose}
          contentStyle={{textAlign: 'center'}}
        />
      </div>
    );
  }
}

export default Settings;