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
import RaisedButton from 'material-ui/RaisedButton';


class Blacklist extends Component {
  constructor() {
    super();
    this.state = {
      blacklist: [
        "www.google.com",
        "www.gmail.com"
      ],
      dialogOpen: false
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
    this.handleDialogClose();
    console.log("handleDelete:", this.state);
  }

  handleDialogOpen = () => {
    this.setState({dialogOpen: true});
  };

  handleDialogClose = () => {
    this.setState({dialogOpen: false});
  };



  render() {
    const actions = (i) => {
      const action =  [
        <FlatButton
          label="Cancel"
          primary={true}
          onClick={this.handleDialogClose}
        />,
        <FlatButton
          label="Delete"
          primary={true}
          keyboardFocused={true}
          onClick={() => this.handleDelete(i)}
        />,
      ];

      return action;

    }





    return (
      <div>

        <h1>My Blacklist:</h1>
        <input placeholder="Enter to add a site to Blacklist..." onKeyPress={e => this.handleKeyPress(e)}/>
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
                  <ActionDeleteForever onClick={this.handleDialogOpen}>Remove Site</ActionDeleteForever>

                  <Dialog
                    title="Dialog With Actions"
                    actions={actions(index)}
                    modal={false}
                    open={this.state.dialogOpen}
                    onRequestClose={this.handleDialogClose}
                  >
                    The actions in this window were passed in as an array of React objects.
                  </Dialog>
                </TableRowColumn>
              </TableRow>
            ))}
          </TableBody>
        </Table>


      </div>



    );
  }
}

export default Blacklist;