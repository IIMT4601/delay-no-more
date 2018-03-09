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

class Blacklist extends Component {
  constructor() {
    super();
    this.state = {
      blacklist: [
        "www.google.com",
        "www.gmail.com"
      ],
      dialogOpen: false,
      indexToBeDeleted: null
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

  handleDelete = () => {
    const i = this.state.indexToBeDeleted;
    this.setState({
      blacklist: [...this.state.blacklist.slice(0, i), ...this.state.blacklist.slice(i + 1)]
    });
    this.handleDialogClose();
    console.log("handleDelete:", this.state);
  }

  handleDialogOpen = (i) => {
    this.setState({
      dialogOpen: true,
      indexToBeDeleted: i
    });
  };

  handleDialogClose = () => {
    this.setState({
      dialogOpen: false,
      indexToBeDeleted: null
    });
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

        <input id="inputBlacklist" placeholder="Enter to add a site to Blacklist..." onKeyPress={e => this.handleKeyPress(e)} />

        <div id="blacklistTable">
          <Table>
            <TableHeader displaySelectAll={false}>
              <TableRow>
                <TableHeaderColumn>Website</TableHeaderColumn>
              </TableRow>
            </TableHeader>
            <TableBody displayRowCheckbox={false}>
              {this.state.blacklist.map((site, index) => (
                <TableRow key={index}>
                  <TableRowColumn>{site}</TableRowColumn>
                  <TableRowColumn>
                    <ActionDeleteForever onClick={() => this.handleDialogOpen(index)} />
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