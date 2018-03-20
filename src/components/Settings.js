import React, { Component } from 'react';
import Checkbox from 'material-ui/Checkbox';


class Settings extends Component {
  constructor() {
    super();
    this.state = {
      checkboxLabels:[{label: "Monday", id: 0}, {label: "Tuesday", id: 1} , {label: "Wednesday", id:2} ,  {label: "Thursday", id:3}, {label: "Friday", id: 4}, {label: "Saturday", id: 5}, {label: "Sunday", id: 6}],
      activeCheckboxes: [],
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


  componentDidMount() {}

  componentWillUnmount() {}

  render() {
    return (
      <div>
        <h1>Settings</h1>
        <h2>Active days and times:</h2>
        <div className="daysOfWeek">
          {this.state.checkboxLabels.map(checkbox =>
            <Checkbox
              key={checkbox.id}
              label={checkbox.label}
              onCheck={() => this.handleCheck(checkbox.id)}
            />
          )}
        </div>
      </div>
    );
  }
}

export default Settings;