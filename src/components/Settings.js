import React, { Component } from 'react';
import Checkbox from 'material-ui/Checkbox';
import FlatButton from 'material-ui/FlatButton';
import Dialog from 'material-ui/Dialog';
import TimePicker from 'material-ui/TimePicker';

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
        db.ref('settings').child(user.uid).child('blacklistActiveDays').child(day).set(p);
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

    return (
      <div>
        <h1>Settings</h1>

        <h2>Blacklist</h2>
        <h3>Active Days</h3>
        <div className="blacklistActiveDays">
          {Object.keys(this.state.blacklistActiveDays).map((day, index) =>
            <Checkbox
              key={index}
              label={day}
              checked={this.state.blacklistActiveDays[day]}
              onCheck={() => this.handleCheck(day)}
              className="blacklistActiveDaysCheckbox"
              iconStyle={{marginRight: '5px'}}
            />
          )}
        </div>

        <h3>Time Intervals</h3>
        <FlatButton
          label="+ Add Time Interval"
          primary={true}
          onClick={this.handleAddTimeInterval}
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
        <div className="timePickers">
          <h3>From</h3>
          <TimePicker
            hintText="12hr Format"
          />
          <h3>To</h3>
          <TimePicker
            hintText="12hr Format"
          />
        </div>
      </div>
    );
  }
}

export default Settings;