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
import ContentAddCircle from 'material-ui/svg-icons/content/add-circle';
import {amber600, transparent, grey900} from 'material-ui/styles/colors';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import TextField from 'material-ui/TextField';
import Snackbar from 'material-ui/Snackbar';
import IconButton from 'material-ui/IconButton';


import firebase from '../firebase';
const auth = firebase.auth();
const db = firebase.database();

class Blacklist extends Component {
  constructor() {
    super();
    this.state = {
      blacklist: {},
      defaultBlacklist:
        { socialMediaSites: [{
          siteName: "Facebook",
          url: "facebook.com",
          logo: "fab fa-facebook",
          logoColor: "fbColor",
          isBlacklisted: false,
          },
          {
            siteName: "Twitter",
            url: "twitter.com",
            logo: "fab fa-twitter",
            logoColor: "twitterColor",
            isBlacklisted: false,
          },
          {
            siteName: "Instagram",
            url: "instagram.com",
            logo: "fab fa-instagram",
            logoColor: "igColor",
            isBlacklisted: false,
          }],

          entertainmentSites: [{
            siteName: "YouTube",
            url: "youtube.com",
            logo: "fab fa-youtube",
            logoColor: "ytColor",
            isBlacklisted: false,
          },
            {
              siteName: "Pinterest",
              url: "pinterest.com",
              logo: "fab fa-pinterest",
              logoColor: "pinterestColor",
              isBlacklisted: false,
            },
            {
              siteName: "Tumblr",
              url: "tumblr.com",
              logo: "fab fa-tumblr",
              logoColor: "tumblrColor",
              isBlacklisted: false,
            },
            {
              siteName: "Reddit",
              url: "reddit.com",
              logo: "fab fa-reddit",
              logoColor: "redditColor",
              isBlacklisted: false,
            },
            {
              siteName: "Twitch",
              url: "twitch.com",
              logo: "fab fa-twitch",
              logoColor: "twitchColor",
              isBlacklisted: false,
            }],
        },
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
  };

  handleKeyPress = e => {
    if (e.key === 'Enter') {
      const url = "http://" + e.target.value;
      try {
        const parsedURL = new URL(url);
        if (Object.values(this.state.blacklist).indexOf(parsedURL.host) > -1) {
          this.setState({
            inputError: "Site had already been blacklisted."
          });
        }
        else {
          auth.onAuthStateChanged(user => {
            if (user) {
              db.ref('blacklists').child(user.uid).push(parsedURL.host, err => {
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
  };

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

  handleSnackbarClose = () => {
    this.setState({
      snackbarOpen: false
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
        autoFocus
      />,
    ];

    const inputStyle = {
      width: '45%',
      margin: '1rem',
      fontSize: '20px',
    };

    const tableStyle = {
      width: '45%',
      margin: '0 auto',
    };

    const colWidthLogo = {
      width: '4rem',
    };

    const colWidthMyBlacklist = {
      width: '11rem',
    };

    const colWidthSiteName = {
      width: '7rem',
    };

    const colWidthActionButton = {
      width: '2rem',
    };

    const deleteButtonStyle = {
      float: 'right',
    };

    const textFieldStyle = {
      borderColor: amber600,
      color: amber600,
    };

    const tableHeaderStyle = {
      borderColor: transparent,
      textColor : grey900,
    };



    return (
      <div>

        <div class="myBlacklist">
          <TextField
            fullWidth={true}
            style={inputStyle}
            hintText="Enter a site you want to blacklist"
            floatingLabelText="http://"
            floatingLabelStyle={textFieldStyle}
            floatingLabelFixed={true}
            errorText={this.state.inputError}
            value={this.state.inputValue}
            onChange={this.handleChange}
            onKeyPress={this.handleKeyPress}
            autoFocus
            underlineFocusStyle={textFieldStyle}
          />
          <br/>
          <Table className="tableNoHighlight" style={tableStyle}>
            <TableHeader
              displaySelectAll={false}
              adjustForCheckbox={false}
              enableSelectAll={false}
              className="table-header"
            >
              <TableRow
                style={tableHeaderStyle}
              >
                <TableHeaderColumn colSpan="3">
                  My Blacklist
                </TableHeaderColumn>
              </TableRow>
            </TableHeader>
            <TableBody displayRowCheckbox={false}>
              {Object.keys(this.state.blacklist).slice().reverse().map(k => (
                <TableRow
                  key={k}
                  displayBorder={false}
                >
                  <TableRowColumn style={colWidthMyBlacklist}>
                    {this.state.blacklist[k]}
                  </TableRowColumn>
                  <TableRowColumn style={colWidthActionButton}>
                    <IconButton>
                      <ActionDeleteForever
                        onClick={() => this.handleDialogOpen(k)}
                        style={deleteButtonStyle}
                        hoverColor={amber600}
                      />
                    </IconButton>
                  </TableRowColumn>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <br />


        <div class="recommendedSites icons">

          <br />

            <Table className="tableNoHighlight" style={tableStyle}>
              <TableHeader
                displaySelectAll={false}
                adjustForCheckbox={false}
                enableSelectAll={false}
                className="table-header"
              >
                <TableRow
                  style={tableHeaderStyle}
                >
                  <TableHeaderColumn colSpan="3">
                    Recommended Social Media Sites
                  </TableHeaderColumn>
                </TableRow>
              </TableHeader>
              <TableBody displayRowCheckbox={false}>
                {Object.keys(this.state.defaultBlacklist.socialMediaSites).map((item, i) => (
                  <TableRow
                    key={i}
                    displayBorder={false}
                  >
                    <TableRowColumn style={colWidthLogo}>
                      <div><i className={this.state.defaultBlacklist.socialMediaSites[item].logo + ' ' + this.state.defaultBlacklist.socialMediaSites[item].logoColor}></i></div>
                    </TableRowColumn>
                    <TableRowColumn style={colWidthSiteName}>
                      {this.state.defaultBlacklist.socialMediaSites[item].siteName}
                    </TableRowColumn>
                    <TableRowColumn style={colWidthActionButton}>
                      <IconButton>
                        <ContentAddCircle
                          hoverColor={amber600}
                        >
                          /*HI IAN ADD ON CLICK FUNCTION HERE*/
                        </ContentAddCircle>
                      </IconButton>
                    </TableRowColumn>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

          <br />

            <Table className="tableNoHighlight" style={tableStyle}>
              <TableHeader
                displaySelectAll={false}
                adjustForCheckbox={false}
                enableSelectAll={false}
                className="table-header"
              >
                <TableRow
                  style={tableHeaderStyle}
                >
                  <TableHeaderColumn colSpan="3">
                    Recommended Entertainment Sites
                  </TableHeaderColumn>
                </TableRow>
              </TableHeader>
              <TableBody displayRowCheckbox={false}>
                {Object.keys(this.state.defaultBlacklist.entertainmentSites).map((item, i) => (
                  <TableRow
                    key={i}
                    displayBorder={false}
                  >
                    <TableRowColumn style={colWidthLogo}>
                      <div><i className={this.state.defaultBlacklist.entertainmentSites[item].logo + ' ' + this.state.defaultBlacklist.entertainmentSites[item].logoColor }></i></div>
                    </TableRowColumn>
                    <TableRowColumn style={colWidthSiteName}>
                      {this.state.defaultBlacklist.entertainmentSites[item].siteName}
                    </TableRowColumn>
                    <TableRowColumn style={colWidthActionButton}>
                      <IconButton>
                        <ContentAddCircle
                          hoverColor={amber600}
                        >
                          /*HI IAN ADD ON CLICK FUNCTION HERE*/
                        </ContentAddCircle>
                      </IconButton>
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