import React, { Component } from 'react';
import Checkbox from 'material-ui/Checkbox';
import FlatButton from 'material-ui/FlatButton';
import Dialog from 'material-ui/Dialog';



class Settings extends Component {
  constructor() {
    super();
    this.state = {
      checkboxLabels:[{label: "Monday", id: 0}, {label: "Tuesday", id: 1} , {label: "Wednesday", id:2} ,  {label: "Thursday", id:3}, {label: "Friday", id: 4}, {label: "Saturday", id: 5}, {label: "Sunday", id: 6}],
      activeCheckboxes: [],
      timeIntervalCounter: 0,
      maxTimeIntervals: 5,
      dialogOpen: false,
    }
  }

  handleCheck = (id) => {
    let found = this.state.activeCheckboxes.includes(id);
    if(found){
      this.setState({
        activeCheckboxes: this.state.activeCheckboxes.filter(x => x !== id)
    });
    }else{
      this.setState({
        activeCheckboxes: [ ...this.state.activeCheckboxes, id ]
    });
    }
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
          {this.state.checkboxLabels.map(checkbox =>
            <Checkbox
              key={checkbox.id}
              label={checkbox.label}
              onCheck={() => this.handleCheck(checkbox.id)}
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