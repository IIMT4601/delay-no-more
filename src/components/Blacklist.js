import React, { Component } from 'react';
import {
  Table,
  TableBody,
  TableHeader,
  TableHeaderColumn,
  TableRow,
  TableRowColumn,
} from 'material-ui/Table';
import ActionDeleteForever from 'material-ui/svg-icons/action/delete-forever';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';

import firebase from '../firebase';
const auth = firebase.auth();
const db = firebase.database();

class Blacklist extends Component {
  constructor(props) {
    super(props);
    this.state = {
      blacklist: {},
      dialogOpen: false,
      keyToBeDeleted: null
    }
  }

  componentDidMount() {
    auth.onAuthStateChanged(user => {
      if (user) {
        db.ref('blacklists').child(user.uid).on('value', snap => {
          console.log("snap.val():", snap.val());
          this.setState({
            blacklist: snap.val() === null ? {} : snap.val()
          });
        });
      }
    });
  }

  componentWillUnmount() {}

  handleKeyPress = e => {
    if (e.key === 'Enter') {
      const site = e.target.value;

      if(this.isURLValid(site)){
        auth.onAuthStateChanged(user => {
          if (user) {
            db.ref('blacklists').child(user.uid).push(site);
          }
        });
      }else{
        alert("Please enter a valid URL");
      }
      e.target.value = "";
      console.log("handleKeyPress:", this.state);
    }
  };

  handleDelete = () => {
    const k = this.state.keyToBeDeleted;
    auth.onAuthStateChanged(user => {
      if (user) {
        db.ref('blacklists').child(user.uid).child(k).remove();
      }
    });
    this.handleDialogClose();
    console.log("handleDelete:", this.state);
  };

  handleDialogOpen = k => {
    this.setState({
      dialogOpen: true,
      keyToBeDeleted: k
    });
  };

  handleDialogClose = () => {
    this.setState({
      dialogOpen: false,
      keyToBeDeleted: null
    });
  };


  isURLValid = str => {
    let regexp1 = /(ftp|http|https|):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/;
    let regexp2 = /www\.(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/;
    let regexp3 = /(http|https|):\/\/www\.(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/;
    return (regexp1.test(str) || regexp2.test(str) || regexp3.test(str));
  };

  render() {
    console.log("this.state:", this.state);

    const actions = [
      <FlatButton
        label="Cancel"
        primary={true}
        onClick={this.handleDialogClose}
      />,
      <FlatButton
        label="Remove"
        primary={true}
        onClick={this.handleDelete}
      />,
    ];

    return (
      <div>
        <h1>My Blacklist</h1>

        <input id="inputBlacklist" placeholder="Enter a site to blacklist..." onKeyPress={e => this.handleKeyPress(e)} />

        <div id="blacklistTable">
          <Table>
            <TableHeader displaySelectAll={false}>
              <TableRow>
                <TableHeaderColumn>Website</TableHeaderColumn>
              </TableRow>
            </TableHeader>
            <TableBody displayRowCheckbox={false}>
              {Object.keys(this.state.blacklist).slice().reverse().map(k => (
                <TableRow key={k}>
                  <TableRowColumn>{this.state.blacklist[k]}</TableRowColumn>
                  <TableRowColumn>
                    <ActionDeleteForever onClick={() => this.handleDialogOpen(k)} />
                  </TableRowColumn>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <Dialog
          title="Confirm Delete"
          actions={actions}
          modal={false}
          open={this.state.dialogOpen}
          onRequestClose={this.handleDialogClose}
        >
          Are you sure you want to remove this website from your blacklist?
        </Dialog>
      </div>
    );
  }
}

export default Blacklist;