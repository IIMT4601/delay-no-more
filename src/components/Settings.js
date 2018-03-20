import React, { Component } from 'react';
import Checkbox from 'material-ui/Checkbox';
import FlatButton from 'material-ui/FlatButton';
import Dialog from 'material-ui/Dialog';



class Settings extends Component {
  constructor() {
    super();
    this.state = {
      checkboxLabels:["MON", "TUE", "WED", "THUR", "FRI", "SAT", "SUN"],
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

  handleCheck = label => {
    let newActiveCheckboxes = this.state.activeCheckboxes;
    newActiveCheckboxes[label] = !this.state.activeCheckboxes[label];

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


  componentDidMount() {}

  componentWillUnmount() {}

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
        <div className="daysOfWeek">
          {this.state.checkboxLabels.map((label, index) =>
            <Checkbox
              key={index}
              label={label}
              onCheck={() => this.handleCheck(label)}
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
      </div>
    );
  }
}

export default Settings;