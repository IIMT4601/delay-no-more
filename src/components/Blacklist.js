import React, { Component } from 'react';
import {
  Table,
  TableBody,
  TableHeader,
  TableHeaderColumn,
  TableRow,
  TableRowColumn,
} from 'material-ui/Table';
import NavigationCancel from 'material-ui/svg-icons/navigation/cancel';
import ContentAddCircle from 'material-ui/svg-icons/content/add-circle';
import {amber600, transparent, grey900, blueGrey900} from 'material-ui/styles/colors';
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
      categoryKey: null,
      keyToBeAdded: null,
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



  handleAddRecommended = (k1, k2) => {
    this.setState({
      categoryKey: k1,
      keyToBeAdded: k2
    }, () => {
      let category;
      switch(k1){
        case 0:
          category = this.state.defaultBlacklist.socialMediaSites;
          break;
        case 1:
          category = this.state.defaultBlacklist.entertainmentSites;
          break;
        default:
          console.log("error...");
      }

      let url = "http://" + category[k2].url;
      console.log("URL to be added: ", url);

      try{
        const parsedURL = new URL(url);
        // console.log("parsedURL: ", parsedURL);
        // console.log("parsedURL.host: ", parsedURL.host);
        if (Object.values(this.state.blacklist).indexOf(parsedURL.host) > -1){
          this.setState({
            snackbarOpen: true,
            snackbarMessage: "This site has already been blacklisted. ",
          });
        }else{
          auth.onAuthStateChanged(user => {
            if (user){
              db.ref('blacklists').child(user.uid).push(parsedURL.host, err => {
                if (err){
                  this.setState({
                    snackbarOpen: true,
                    snackbarMessage: "Unable to save site to blacklist. Please try again."
                  });
                }else{
                  this.setState({
                    snackbarOpen: true,
                    snackbarMessage: "Site added to your blacklist."
                  });
                }
              });
            }
          });
        }
      }catch(err){
        this.setState({
          inputError: "There are some problems with the handleAddRecommended function."
        });
      }
    })

  };

  render() {
    console.log("this.state:", this.state);

    const actions = [
      <FlatButton
        label="Cancel"
        onClick={this.handleDialogClose}
      />,
      <FlatButton
        label="Remove"
        onClick={this.handleDelete}
        autoFocus
        className="blacklist-flat-button"
      />,
    ];

    const inputStyle = {
      width: '45%',
      margin: '1rem',
      fontSize: '20px',
    };

    const deleteButtonStyle = {
      float: 'right',
    };


    const tableStyle = {
      width: '45%',
      margin: '0 auto',
    };

    const colWidthLogo = {
      width: '2.5em',
    };

    const colWidthMyBlacklist = {
      width: '12.5rem',
    };

    const colWidthSiteName = {
      width: '10rem',
    };

    const colWidthActionButton = {
      width: '2rem',
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
            <TableBody
              displayRowCheckbox={false}
            >
              {Object.keys(this.state.blacklist).slice().reverse().map(k => (
                <TableRow
                  key={k}
                >
                  <TableRowColumn style={colWidthMyBlacklist}>
                    {this.state.blacklist[k]}
                  </TableRowColumn>
                  <TableRowColumn style={colWidthActionButton}>
                    <IconButton>
                      <NavigationCancel
                        onClick={() => this.handleDialogOpen(k)}
                        style={deleteButtonStyle}
                        hoverColor={blueGrey900}
                        className="iconTrashButtonStyle"
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

          {Object.keys(this.state.defaultBlacklist).map((categories, k1) => (
            <Table
              className="tableNoHighlight"
              style={tableStyle}
              key={k1}
            >
              <TableHeader
                displaySelectAll={false}
                adjustForCheckbox={false}
                enableSelectAll={false}
                className="table-header"
              >
                <TableRow style={tableHeaderStyle}>
                  <TableHeaderColumn colSpan="3">
                    <div className={categories[k1]}></div>
                  </TableHeaderColumn>
                </TableRow>
              </TableHeader>
              <TableBody displayRowCheckbox={false}>
                {Object.keys(this.state.defaultBlacklist[categories]).map((sites, k2) => (
                  <TableRow
                    key={k2}
                    displayBorder={false}
                  >
                    <TableRowColumn style={colWidthLogo}>
                      <div><i className={this.state.defaultBlacklist[categories][sites].logo
                                      + ' ' + this.state.defaultBlacklist[categories][sites].logoColor}>

                        </i></div>
                    </TableRowColumn>
                    <TableRowColumn style={colWidthSiteName}>
                      {this.state.defaultBlacklist[categories][sites].siteName}
                    </TableRowColumn>
                    <TableRowColumn style={colWidthActionButton}>
                      <IconButton>
                        <ContentAddCircle
                          hoverColor={amber600}
                          className="iconAddButtonStyle"
                          onClick={() => this.handleAddRecommended(k1,k2)}
                        >
                        </ContentAddCircle>
                      </IconButton>
                    </TableRowColumn>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ))}
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