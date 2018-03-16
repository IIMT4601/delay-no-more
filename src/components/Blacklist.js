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
import TextField from 'material-ui/TextField';
import Snackbar from 'material-ui/Snackbar';

import firebase from '../firebase';
const auth = firebase.auth();
const db = firebase.database();

class Blacklist extends Component {
  constructor() {
    super();
    this.state = {
      blacklist: {},
      dialogOpen: false,
      keyToBeDeleted: null,
      inputValue: "",
      inputError: "",
      snackbarOpen: false,
      snackbarMessage: ""
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

  handleChange = e => {
    this.setState({
      inputValue: e.target.value,
      inputError: ""
    });
  }

  handleKeyPress = e => {
    if (e.key === 'Enter') {
      const url = "http://" + e.target.value;
      try {
        const parsedURL = new URL(url);
        if (Object.values(this.state.blacklist).indexOf(parsedURL.hostname) > -1) {
          this.setState({
            inputError: "Site had already been blacklisted."
          });
        }
        else {
          auth.onAuthStateChanged(user => {
            if (user) {
              db.ref('blacklists').child(user.uid).push(parsedURL.hostname, err => {
                if (err) {
                  this.setState({
                    snackbarOpen: true,
                    snackbarMessage: "Unable to save site to blacklist. Please try again."
                  });
                }
                else {
                  this.setState({
                    snackbarOpen: true,
                    snackbarMessage: "Site added to your blacklist"
                  });                   
                }
              });
            }
          });
          this.setState({
            inputValue: ""
          });
        }
      }
      catch (err) {
        this.setState({
          inputError: "Please enter a valid URL."
        });
      }
      console.log("handleKeyPress:", this.state);
    }
  }

  handleDelete = () => {
    const k = this.state.keyToBeDeleted;
    auth.onAuthStateChanged(user => {
      if (user) {
        db.ref('blacklists').child(user.uid).child(k).remove(err => {
          if (err) {
            this.setState({
              snackbarOpen: true,
              snackbarMessage: "Unable to remove site from blacklist. Please try again."
            });
          }
          else {
            this.setState({
              snackbarOpen: true,
              snackbarMessage: "Site removed from your blacklist"
            });
          }
        });
      }
    });
    this.handleDialogClose();
    console.log("handleDelete:", this.state);
  }

  handleDialogOpen = k => {
    this.setState({
      dialogOpen: true,
      keyToBeDeleted: k
    });
  }

  handleDialogClose = () => {
    this.setState({
      dialogOpen: false,
      keyToBeDeleted: null
    });
  }

  handleSnackbarClose = () => {
    this.setState({
      snackbarOpen: false
    });
  }

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
        autoFocus
      />,
    ];

    return (
      <div>
        <TextField
          fullWidth={false}
          hintText="Enter a site to blacklist..."
          floatingLabelText="http://"
          floatingLabelFixed={true}
          errorText={this.state.inputError}
          value={this.state.inputValue}
          onChange={this.handleChange}
          onKeyPress={this.handleKeyPress}
          autoFocus
        />

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
          title={this.state.blacklist[this.state.keyToBeDeleted]}
          actions={actions}
          modal={false}
          open={this.state.dialogOpen}
          onRequestClose={this.handleDialogClose}
        >
          Are you sure you want to remove this website from your blacklist?
        </Dialog>

        <Snackbar
          open={this.state.snackbarOpen}
          message={this.state.snackbarMessage}
          autoHideDuration={4000}
          onRequestClose={this.handleSnackbarClose}
        />
      </div>
    );
  }
}

export default Blacklist;