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
    this.handleKeyPress = this.handleKeyPress.bind(this);
  }

  componentDidMount() {


  }

  componentWillUnmount() {}

  handleKeyPress = (e) => {
    if (e.key === 'Enter'){
      e.preventDefault();
      let newBlacklist = this.state.blacklist.push(e.target.value); //put website name into blacklist array
      this.setState({
        blacklist: newBlacklist
      });
      console.log(e.target.value);
      console.log(this.state);
    }

  }

  render() {
    return (
      <div>
        <h1>My Blacklist:</h1>
        <input onKeyPress={this.handleKeyPress}/>
        <ul>

          {this.state.blacklist.map((site, index) => (
            <li key={index}>{site}</li>
          ))}
        </ul>
      </div>
    );
  }
}

export default Blacklist;