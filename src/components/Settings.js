import React, { Component } from 'react';
import Checkbox from 'material-ui/Checkbox';
import FlatButton from 'material-ui/FlatButton';
import Dialog from 'material-ui/Dialog';
import TimePicker from 'material-ui/TimePicker';

class Settings extends Component {
  constructor() {
    super();
    this.state = {
      activeCheckboxes:{
        "MON": false,
        "TUE": false,
        "WED": false,
        "THUR": false,
        "FRI": false,
        "SAT": false,
        "SUN": false
      },
      timeIntervalCounter: 0,
      maxTimeIntervals: 5,
      dialogOpen: false,
    }
  }

  componentDidMount() {}

  componentWillUnmount() {}

  handleCheck = day => {
    let newActiveCheckboxes = this.state.activeCheckboxes;
    newActiveCheckboxes[day] = !this.state.activeCheckboxes[day];

    this.setState({
      ...this.state,
      activeCheckboxes: newActiveCheckboxes
    });

    console.log("activeCheckboxes: ", this.state.activeCheckboxes);
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
        <h2>Set Active Days</h2>
        <div>
          {Object.keys(this.state.activeCheckboxes).map((day, index) =>
            <Checkbox
              key={index}
              label={day}
              onCheck={() => this.handleCheck(day)}
            />
          )}
        </div>
        <h2>Set Time Intervals</h2>
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