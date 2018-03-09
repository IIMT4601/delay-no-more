import React, { Component } from 'react';

class Blacklist extends Component {
  constructor() {
    super();
    this.state = {
      blacklist: [
        "www.google.com",
        "www.gmail.com"
      ]
    }
  }

  componentDidMount() {}

  componentWillUnmount() {}

  handleKeyPress = (e) => {
    if (e.key === 'Enter'){
      //insert website into blacklist
      this.setState({
        blacklist: [e.target.value, ...this.state.blacklist]
      });
      e.target.value = ""; //clear text area after submit
      console.log("handleKeyPress:", this.state);
    }
  }

  handleDelete = (i) => {
    this.setState({
      blacklist: [...this.state.blacklist.slice(0, i), ...this.state.blacklist.slice(i + 1)]
    });
    console.log("handleDelete:", this.state);
  }

  render() {
    return (
      <div>
        <h1>My Blacklist:</h1>
        <input placeholder="Enter to add a site to Blacklist..." onKeyPress={e => this.handleKeyPress(e)}/>
        <ul>
          {this.state.blacklist.map((site, index) => (
            <li key={index}>
              {site}
              <button onClick={() => this.handleDelete(index)}>Remove Site</button>
            </li>
          ))}
        </ul>
      </div>
    );
  }
}

export default Blacklist;